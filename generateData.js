#!/usr/bin/env node

import { Search } from './js/search/search.js';
import { Indexer } from './js/search/indexer.js';

import fs from 'fs';
const PRINT = true;
const NO_PRINT = false;

try {
    main();
} catch (error) {
    console.error(error);
    process.exit(1);
}

function main() {
    const engine = new Search(new Indexer());
    const list = [];
    const tagMap = {};
    const pageMap = {};
    const mentionMap = {};

    getFiles('./_notes', 'notes', list);
    //getFiles('./_posts', 'blog', list);

    const dataList = list
        .map((file) => collectData(file))
        .filter((row) => row)
        .sort(lexicalOrderingBy('fileName'));

    dataList.forEach((data) => {
        let str = '';
        str += `<title>${data.title}</title>`;
        data.summary && (str += `<summary>${data.summary}</summary>`);
        data.tags && (str += `<tag>${data.tags.join(' ')}</tag>`);
        str += data.body.replace(/```[\s\S]*?```/g, '');
        engine.indexer.addIndex(data.fileName, str);
    });

    const notesFileIndex = buildNotesFileIndex(dataList);

    dataList.forEach(function collectTagMap(data) {
        if (!data.tags) {
            return;
        }

        data.tags.forEach((tag) => {
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
        tagMap[tag].sort(lexicalOrderingBy('fileName'));
    }

    dataList.sort(lexicalOrderingBy('fileName')).forEach((page) => {
        pageMap[page.fileName] = {
            type: page.type,
            title: page.title,
            summary: page.summary,
            doc_type: page.doc_type,
            url: page.url,
            updated: page.updated || page.date,
            resource: page.resource,
            body: page.body,
        };
    });

    dataList.forEach((page) => {
        if (page.mentions == null || page.mentions.length == 0) return;
        for (let i = 0; i < page.mentions.length; ++i) {
            let url = page.mentions[i].url || '';
            url = url.replace(/^\/+/, '').replace(/^wiki\//, '');
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
    saveMentionList(mentionMap);
    saveToFile(`./data/search-index.json`, engine.indexer.toJson(), NO_PRINT);
    saveToFile(`./data/notes-file-index.json`, JSON.stringify(notesFileIndex, null, 1), NO_PRINT);
}

function lexicalOrderingBy(property) {
    return (a, b) => a[property].toLowerCase().localeCompare(b[property].toLowerCase());
}

function buildNotesFileIndex(dataList) {
    // Obsidian "Shortest" link resolution support:
    // - Map basename -> list of docIds for disambiguation.
    const index = {};
    dataList.forEach((data) => {
        if (!data || data.type !== 'notes') return;
        const fileName = data.fileName || '';
        const baseName = fileName.split('/').pop();
        if (!baseName) return;
        if (!index[baseName]) index[baseName] = [];
        index[baseName].push(fileName);
    });
    Object.keys(index).forEach((key) => {
        index[key].sort();
    });
    return index;
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
      "url": "/notes/agile",
      "updated": "2020-01-20 21:57:44 +0900",
      "children": []
    },
    "Tompson-s-rule-for-first-time-telescope-makers": {
      "type": "wiki",
      "title": "망원경 규칙 (Telescope Rule)",
      "summary": "4인치 반사경을 만든 다음에 6인치 반사경을 만드는 것이, 6인치 반사경 하나 만드는 것보다 더 빠르다",
      "parent": "proverb",
      "url": "/notes/Tompson-s-rule-for-first-time-telescope-makers",
      "updated": "2019-11-24 09:36:53 +0900",
      "children": []
    }
  }
}
*/

function saveTagFiles(tagMap, pageMap) {
    fs.mkdirSync('./data/tag', { recursive: true }, (err) => {
        if (err) {
            return console.log(err);
        }
    });

    const completedTags = {};

    for (const tag in tagMap) {
        if (completedTags[tag.toLowerCase()]) {
            console.log('중복 태그가 있습니다.', tag);
            break;
        }
        completedTags[tag.toLowerCase()] = true;

        const collection = [];
        const tagDatas = tagMap[tag];

        for (const index in tagDatas) {
            const tagData = tagDatas[index];
            const data = pageMap[tagData.fileName];

            const documentId = data.type === 'notes' ? tagData.fileName : data.url;

            collection.push(documentId);
        }

        saveToFile(`./data/tag/${tag}.json`, JSON.stringify(collection, null, 1), NO_PRINT);
    }
}

/**
 * 파일 하나의 정보 파일을 만든다.
 * 각 파일 하나는 자신만의 정보를 갖는 json 파일을 갖게 된다.
 * 예를 들어 math.md 라는 파일이 있다면 ./data/metadata/math.json 파일이 만들어진다.
 * json 파일의 내용은 자신의 metadata와 자식 노트들의 목록이 된다.
 */
function saveMetaDataFiles(pageMap) {
    for (const page in pageMap) {
        const data = pageMap[page];
        const fileName = page;
        const dirName = `./data/metadata/${fileName}`
            .replace(/(\/\/)/g, '/')
            .replace(/[/][^/]*$/, '');

        fs.mkdirSync(dirName, { recursive: true }, (err) => {
            if (err) {
                return console.log(err);
            }
        });

        saveToFile(`./data/metadata/${fileName}.json`, JSON.stringify(data, null, 1), NO_PRINT);
    }
}

/**
 * 노트가 갖는 멘션의 정보를 파일로 저장한다.
 */
function saveMentionList(mentionMap) {
    for (const mention in mentionMap) {
        const data = mentionMap[mention];
        const fileName = mention;
        const dirName = `./data/mention/${fileName}`
            .replace(/(\/\/)/g, '/')
            .replace(/[/][^/]*$/, '');

        fs.mkdirSync(dirName, { recursive: true }, (err) => {
            if (err) {
                return console.log(err);
            }
        });

        saveToFile(`./data/mention/${fileName}.json`, JSON.stringify(data, null, 1), NO_PRINT);
    }
}

/**
 * 모든 노트 파일의 목록 json 파일을 생성합니다.
 */
/**
 * 태그 하나가 갖는 자식 노트의 수를 파일로 저장한다.
 */
function saveTagCount(tagMap) {
    const list = [];
    for (const tag in tagMap) {
        list.push({
            name: tag,
            size: tagMap[tag].length,
        });
    }
    const sortedList = list.sort(lexicalOrderingBy('name'));

    saveToFile('./data/tag_count.json', JSON.stringify(sortedList, null, 1), PRINT);
}

/**
 * 주어진 문자열을 파일로 저장합니다.
 *
 * @param fileLocation 파일 이름을 포함한 저장할 경로
 * @param dataString 파일의 내용이 될 문자열
 * @param isPrintWhenSuccess 파일이 저장되었을 때 표준 출력으로 메시지를 띄우려 한다면 true
 */
function saveToFile(fileLocation, dataString, isPrintWhenSuccess) {
    try {
        fs.writeFileSync(fileLocation, dataString);
        if (isPrintWhenSuccess) {
            console.log(`The file "${fileLocation}" has been saved.`);
        }
    } catch (err) {
        throw err;
    }
}

function parseTagsValue(value) {
    if (!value) return [];
    let raw = value.trim();
    if (raw.startsWith('[') && raw.endsWith(']')) {
        raw = raw.slice(1, -1);
    }
    return raw
        .replace(/,/g, ' ')
        .split(/\s+/)
        .map((tag) => tag.trim())
        .filter(Boolean);
}

function parseInfo(file, info, body) {
    const obj = {
        fileName: file.path.replace(/^\.\/_notes\/(.+)?\.md$/, '$1'),
        type: file.type,
        url: '',
        mentions: [],
        body: body,
    };

    const rawData = info.split('\n');

    for (let i = 0; i < rawData.length; i++) {
        const str = rawData[i];
        const result = /^\s*([^:]+):\s*(.*)\s*$/.exec(str);

        if (result == null) {
            continue;
        }

        const key = result[1].trim();
        let val = result[2].trim();

        if (key === 'tags' || key === 'tag') {
            if (!val) {
                const list = [];
                let j = i + 1;
                while (j < rawData.length) {
                    const line = rawData[j];
                    const item = /^\s*-\s*(.+)\s*$/.exec(line);
                    if (!item) break;
                    list.push(item[1].trim());
                    j++;
                }
                if (list.length > 0) {
                    obj.tags = list;
                }
                i = j - 1;
                continue;
            }
            obj.tags = parseTagsValue(val);
            continue;
        }

        val = val.replace(/\[{2}\/?|\]{2}/g, ''); // 노트 이름 앞뒤의 [[  ]], [[/ ]] 를 제거한다.
        obj[key] = val;
    }

    if (file.type === 'blog') {
        obj.url = '/blog/' + obj.date.replace(/^(\d{4})-(\d{2})-(\d{2}).*$/, '$1/$2/$3/');
        obj.url += obj.fileName.replace(/^.*[/]\d{4}-\d{2}-\d{2}-([^/]*)\.md$/, '$1');
    } else if (file.type === 'notes') {
        obj.url = obj.permalink
            ? obj.permalink
            : file.path.replace(/^\.\/_notes/, '/notes').replace(/\.md$/, '');
    }

    if (!obj.tags && obj.tag) {
        obj.tags = parseTagsValue(obj.tag);
    }

    if (!obj.title) {
        obj.title = inferTitle(file, body);
    }

    const mentions = body.match(/.*\[\[.+?\]\].*/g);

    mentions &&
        mentions.forEach((mention) => {
            const wiki_links = mention.match(/\[\[.+?\]\]/g);
            for (const wiki_link of wiki_links) {
                const path = wiki_link
                    .replace(/((\[\[)|(\]\]))/g, '')
                    .split('|')[0]
                    .trim();
                let prefix = '';
                const looksAbsolute = path.includes('/');
                if (path && path[0] !== '/' && !looksAbsolute) {
                    prefix = file.path.replace(/^(.*\/).*\.md/, '$1').replace(/^\.\/_notes/, '');
                }
                obj.mentions.push({
                    paragraph: mention,
                    url: prefix + path,
                });
            }
        });

    return obj;
}


function inferTitle(file, body) {
    const headingMatch = body.match(/^#\s+(.+)$/m);
    if (headingMatch) {
        return headingMatch[1].trim();
    }
    return file.name.replace(/\.md$/, '');
}

function isDirectory(path) {
    return fs.lstatSync(path).isDirectory();
}

function isMarkdown(fileName) {
    return /\.md$/.test(fileName);
}

function isExcludedDir(dirName) {
    // Exclude template folders (case-insensitive) and assets.
    const name = dirName.toLowerCase();
    return name === 'assets' || name === 'templates' || name === '_templates';
}

function getFiles(path, type, array, testFileList = null) {
    fs.readdirSync(path).forEach((fileName) => {
        const subPath = `${path}/${fileName}`;

        if (isDirectory(subPath)) {
            if (isExcludedDir(fileName)) return;
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
    const data = fs.readFileSync(file.path, 'utf8');

    const sep = '---';
    const hasFrontMatter = data.startsWith(sep);
    const s1 = hasFrontMatter ? data.indexOf(sep) + sep.length : -1;
    const s2 = hasFrontMatter ? data.indexOf(sep, s1) : -1;
    const info = hasFrontMatter && s2 !== -1 ? data.substring(s1, s2) : '';
    const body = hasFrontMatter && s2 !== -1 ? data.substring(s2 + sep.length) : data;

    return parseInfo(file, info, body);
}
