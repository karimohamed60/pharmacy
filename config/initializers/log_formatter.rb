class Logger::SimpleFormatter
    def call(severity, timestamps, progname, msg)
        "[#{severity}] #{msg}\n"
    end
end