document.addEventListener("DOMContentLoaded", () => {
    const toc_links = document.querySelectorAll("#markdown-toc a");
    const sections = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    let last_active_id = "";

    window.addEventListener("scroll", () => {
        let current_section = "";

        sections.forEach((section) => {
            const section_top = section.offsetTop;
            if (window.scrollY >= section_top - 10) {
                current_section = section.getAttribute("id");
            }
        });

        if (current_section === last_active_id) return;
        last_active_id = current_section;

        let active_link = null;
        toc_links.forEach((link) => {
            link.classList.remove("active-toc");
            const href = link.getAttribute("href") || "";
            const target = href.startsWith("#") ? href.slice(1) : href;
            if (decodeURIComponent(target) === current_section) {
                link.classList.add("active-toc");
                active_link = link;
            }
        });

        if (active_link) {
            active_link.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
    });
});
