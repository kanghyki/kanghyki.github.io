#!/usr/bin/env node

import { Search } from "./js/search/search.js";
import { Indexer } from "./js/search/indexer.js";

import fs from "fs";
const PRINT = true;
const NO_PRINT = false;

main();

function main() {
    const engine = new Search(new Indexer());
    const list = [];
    const tagMap = {};
    const pageMap = {};
    const mentionMap = {};

    getFiles("./_wiki", "wiki", list);
    //getFiles('./_posts', 'blog', list);

    const dataList = list
        .map((file) => collectData(file))
        .filter((row) => row && row.public == "true")
        .sort(lexicalOrderingBy("fileName"));

    dataList.forEach((data) => {
        let str = "";
        str += `<title>${data.title}</title>`;
        data.summary && (str += `<summary>${data.summary}</summary>`);
        data.tag && (str += `<tag>${data.tag.join(" ")}</tag>`);
        str += data.body
            .replace(/\* TOC\s{:toc}/, "")
            .replace(/```[\s\S]*?```/g, "");
        engine.indexer.addIndex(data.fileName, str);
    });

    dataList.forEach(function collectTagMap(data) {
        if (!data.tag) {
            return;
        }

        data.tag.forEach((tag) => {
            if (!tagMap[tag]) {
                tagMap[tag] = [];
            }
            tagMap[tag].push({
                fileName: data.fileName,
                // updated: data.updated || data.date,
            });
        });
    });

    for (const tag in tagMap) {
        tagMap[tag].sort(lexicalOrderingBy("fileName"));
    }

    dataList.sort(lexicalOrderingBy("fileName")).forEach((page) => {
        pageMap[page.fileName] = {
            type: page.type,
            title: page.title,
            summary: page.summary,
            parent: page.parent,
            url: page.url,
            updated: page.updated || page.date,
            resource: page.resource,
            children: [],
            body: page.body,
        };
    });

    dataList.forEach((page) => {
        if (page.parent) {
            const parent = pageMap[page.parent];

            if (parent && parent.children) {
                parent.children.push(page.fileName);
            }
        }
    });

    dataList.forEach((page) => {
        if (page.mentions == null || page.mentions.length == 0) return;
        for (let i = 0; i < page.mentions.length; ++i) {
            const url = page.mentions[i].url;
            if (!mentionMap[url]) {
                mentionMap[url] = [];
            }
            mentionMap[url].push({
                from: page.fileName,
                paragraph: page.mentions[i].paragraph,
            });
        }
    });

    saveTagFiles(tagMap, pageMap);
    saveTagCount(tagMap);
    saveMetaDataFiles(pageMap);
    saveDocumentUrlList(pageMap);
    saveMentionList(mentionMap);
    saveToFile(`./data/search-index.json`, engine.indexer.toJson(), NO_PRINT);
}

function lexicalOrderingBy(property) {
    return (a, b) =>
        a[property].toLowerCase().localeCompare(b[property].toLowerCase());
}

/**
 * tag 하나의 정보 파일을 만든다.
 * 각 태그 하나는 하나의 json 파일을 갖게 된다.
 * 예를 들어 math 라는 태그가 있다면 ./data/tag/math.json 파일이 만들어진다.
 * json 파일의 내용은 fileName과 collection으로 구성된다.
 * 다음은 GNU.json 파일의 예이다.
 *
{
  "fileName": "agile",
  "collection": {
    "agile": {
      "type": "wiki",
      "title": "애자일(agile)에 대한 토막글 모음",
      "summary": "",
      "parent": "software-engineering",
      "url": "/wiki/agile",
      "updated": "2020-01-20 21:57:44 +0900",
      "children": []
    },
    "Tompson-s-rule-for-first-time-telescope-makers": {
      "type": "wiki",
      "title": "망원경 규칙 (Telescope Rule)",
      "summary": "4인치 반사경을 만든 다음에 6인치 반사경을 만드는 것이, 6인치 반사경 하나 만드는 것보다 더 빠르다",
      "parent": "proverb",
      "url": "/wiki/Tompson-s-rule-for-first-time-telescope-makers",
      "updated": "2019-11-24 09:36:53 +0900",
      "children": []
    }
  }
}
*/

function saveTagFiles(tagMap, pageMap) {
    fs.mkdirSync("./data/tag", { recursive: true }, (err) => {
        if (err) {
            return console.log(err);
        }
    });

    const completedTags = {};

    for (const tag in tagMap) {
        if (completedTags[tag.toLowerCase()]) {
            console.log("중복 태그가 있습니다.", tag);
            break;
        }
        completedTags[tag.toLowerCase()] = true;

        const collection = [];
        const tagDatas = tagMap[tag];

        for (const index in tagDatas) {
            const tagData = tagDatas[index];
            const data = pageMap[tagData.fileName];

            const documentId =
                data.type === "wiki" ? tagData.fileName : data.url;

            collection.push(documentId);
        }

        saveToFile(
            `./data/tag/${tag}.json`,
            JSON.stringify(collection, null, 1),
            NO_PRINT
        );
    }
}

/**
 * 파일 하나의 정보 파일을 만든다.
 * 각 파일 하나는 자신만의 정보를 갖는 json 파일을 갖게 된다.
 * 예를 들어 math.md 라는 파일이 있다면 ./data/metadata/math.json 파일이 만들어진다.
 * json 파일의 내용은 자신의 metadata와 자식 문서들의 목록이 된다.
 */
function saveMetaDataFiles(pageMap) {
    for (const page in pageMap) {
        const data = pageMap[page];
        const fileName = data.url.replace(/^[/]wiki[/]/, "");
        const dirName = `./data/metadata/${fileName}`
            .replace(/(\/\/)/g, "/")
            .replace(/[/][^/]*$/, "");

        fs.mkdirSync(dirName, { recursive: true }, (err) => {
            if (err) {
                return console.log(err);
            }
        });

        saveToFile(
            `./data/metadata/${fileName}.json`,
            JSON.stringify(data, null, 1),
            NO_PRINT
        );
    }
}

/**
 * 문서가 갖는 멘션의 정보를 파일로 저장한다.
 */
function saveMentionList(mentionMap) {
    for (const mention in mentionMap) {
        const data = mentionMap[mention];
        const fileName = mention;
        const dirName = `./data/mention/${fileName}`
            .replace(/(\/\/)/g, "/")
            .replace(/[/][^/]*$/, "");

        fs.mkdirSync(dirName, { recursive: true }, (err) => {
            if (err) {
                return console.log(err);
            }
        });

        saveToFile(
            `./data/mention/${fileName}.json`,
            JSON.stringify(data, null, 1),
            NO_PRINT
        );
    }
}

/**
 * 모든 문서 파일의 목록 json 파일을 생성합니다.
 */
function saveDocumentUrlList(pageMap) {
    const urlList = [];
    for (const page in pageMap) {
        const data = pageMap[page];
        urlList.push(data.url);
    }
    saveToFile(
        "./data/total-document-url-list.json",
        JSON.stringify(urlList, null, 1),
        PRINT
    );
}

/**
 * 태그 하나가 갖는 자식 문서의 수를 파일로 저장한다.
 */
function saveTagCount(tagMap) {
    const list = [];
    for (const tag in tagMap) {
        list.push({
            name: tag,
            size: tagMap[tag].length,
        });
    }
    const sortedList = list.sort(lexicalOrderingBy("name"));

    saveToFile(
        "./data/tag_count.json",
        JSON.stringify(sortedList, null, 1),
        PRINT
    );
}

/**
 * 주어진 문자열을 파일로 저장합니다.
 *
 * @param fileLocation 파일 이름을 포함한 저장할 경로
 * @param dataString 파일의 내용이 될 문자열
 * @param isPrintWhenSuccess 파일이 저장되었을 때 표준 출력으로 메시지를 띄우려 한다면 true
 */
function saveToFile(fileLocation, dataString, isPrintWhenSuccess) {
    fs.writeFile(fileLocation, dataString, function (err) {
        if (err) {
            return console.log(err);
        }
        if (isPrintWhenSuccess) {
            console.log(`The file "${fileLocation}" has been saved.`);
        }
    });
}

function parseInfo(file, info, body) {
    if (info === null) {
        return undefined;
    }

    const obj = {
        fileName: file.path.replace(/^\.\/_wiki\/(.+)?\.md$/, "$1"),
        type: file.type,
        url: "",
        modified: fs.statSync(file.path).mtime,
        mentions: [],
        body: body,
    };

    const rawData = info.split("\n");

    rawData.forEach((str) => {
        const result = /^\s*([^:]+):\s*(.+)\s*$/.exec(str);

        if (result == null) {
            return;
        }

        const key = result[1].trim();
        const val = result[2].trim().replace(/\[{2}\/?|\]{2}/g, ""); // 문서 이름 앞뒤의 [[  ]], [[/ ]] 를 제거한다.
        obj[key] = val;
    });

    if (file.type === "blog") {
        obj.url =
            "/blog/" +
            obj.date.replace(/^(\d{4})-(\d{2})-(\d{2}).*$/, "$1/$2/$3/");
        obj.url += obj.fileName.replace(
            /^.*[/]\d{4}-\d{2}-\d{2}-([^/]*)\.md$/,
            "$1"
        );
    } else if (file.type === "wiki") {
        obj.url = file.path.replace(/^\.\/_wiki/, "/wiki").replace(/\.md$/, "");
    }

    if (obj.tag) {
        obj.tag = obj.tag.split(/\s+/);
    }

    const mentions = body.match(/.*\[\[.+?\]\].*/g);

    mentions &&
        mentions.forEach((mention) => {
            const wiki_links = mention.match(/\[\[.+?\]\]/g);
            for (const wiki_link of wiki_links) {
                const path = wiki_link.replace(/((\[\[)|(\]\]))/g, "");
                let prefix = "";
                if (path && path[0] !== "/") {
                    prefix = file.path
                        .replace(/^(.*\/).*\.md/, "$1")
                        .replace(/^\.\/_wiki/, "");
                }
                obj.mentions.push({
                    paragraph: mention,
                    url: prefix + path,
                });
            }
        });

    return obj;
}

function isDirectory(path) {
    return fs.lstatSync(path).isDirectory();
}

function isMarkdown(fileName) {
    return /\.md$/.test(fileName);
}

function getFiles(path, type, array, testFileList = null) {
    fs.readdirSync(path).forEach((fileName) => {
        const subPath = `${path}/${fileName}`;

        if (isDirectory(subPath)) {
            return getFiles(subPath, type, array, testFileList);
        }
        if (isMarkdown(fileName)) {
            if (testFileList && !testFileList.includes(fileName)) {
                return;
            }

            const obj = {
                path: `${path}/${fileName}`,
                type: type,
                name: fileName,
                children: [],
            };
            return array.push(obj);
        }
    });
}

function collectData(file) {
    const data = fs.readFileSync(file.path, "utf8");

    const sep = "---";
    const s1 = data.indexOf(sep) + sep.length;
    const s2 = data.indexOf(sep, s1);
    const info = data.substring(s1, s2);
    const body = data.substring(s2 + sep.length);

    return parseInfo(file, info, body);
}
