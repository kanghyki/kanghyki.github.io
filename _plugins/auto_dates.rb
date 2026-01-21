require "open3"
require "time"

module Jekyll
  module AutoDates
    def self.git_times(path)
      out, status = Open3.capture2("git", "log", "--follow", "--format=%cI", "--", path)
      return [nil, nil] unless status.success?

      lines = out.split("\n")
      return [nil, nil] if lines.empty?

      updated = parse_time(lines[0])
      created = parse_time(lines[-1])
      [created, updated]
    end

    def self.parse_time(value)
      Time.iso8601(value)
    rescue ArgumentError
      nil
    end
  end
end

Jekyll::Hooks.register [:pages, :documents], :pre_render do |page|
  path = page.path
  created, updated = Jekyll::AutoDates.git_times(path)

  file_mtime = File.exist?(path) ? File.mtime(path) : nil
  page.data["created"] ||= created || file_mtime
  page.data["updated"] ||= updated || file_mtime
end
