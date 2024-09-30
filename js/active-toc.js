document.addEventListener("DOMContentLoaded", () => {
    const toc_links = document.querySelectorAll("#markdown-toc a");
    const sections = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

    window.addEventListener("scroll", () => {
        let current_section = "";

        sections.forEach((section) => {
            const section_top = section.offsetTop;
            if (window.scrollY >= section_top - 10) {
                current_section = section.getAttribute("id");
            }
        });

        toc_links.forEach((link) => {
            link.classList.remove("active-toc");
            if (link.getAttribute("href") === `#${current_section}`) {
                link.classList.add("active-toc");
            }
        });
    });
});
