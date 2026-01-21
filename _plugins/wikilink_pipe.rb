module Jekyll
  module WikiLinkPipe
    TOKEN = "@@WIKILINK_PIPE@@".freeze

    def self.replace_pipes(content)
      content.gsub(/\[\[([^\]]+?)\|([^\]]+?)\]\]/) do
        "[[#{$1}#{TOKEN}#{$2}]]"
      end
    end
  end
end

Jekyll::Hooks.register [:pages, :documents], :pre_render do |page|
  next unless page.respond_to?(:content) && page.content

  page.content = Jekyll::WikiLinkPipe.replace_pipes(page.content)
end
