require "fileutils"

Jekyll::Hooks.register :site, :post_write do |site|
  source = File.join(site.source, "_notes", "assets")
  dest = File.join(site.dest, "wiki", "assets")
  next unless Dir.exist?(source)

  FileUtils.mkdir_p(dest)
  FileUtils.cp_r(Dir.glob(File.join(source, "*")), dest, remove_destination: false)
end
