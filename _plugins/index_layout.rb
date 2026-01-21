Jekyll::Hooks.register [:pages, :documents], :pre_render do |page|
  next unless page.respond_to?(:path) && page.path
  next unless page.path.end_with?("/index.md")

  page.data["layout"] = "wiki-index"
end
