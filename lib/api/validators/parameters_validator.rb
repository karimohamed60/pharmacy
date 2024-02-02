module Api
    module Validators
        class ParametersValidator
            def self.validate_search_params?(input)
                sql_injection_patterns = ["'", ";", "--", "/*", "*/", "||", "&&", "UNION", "SELECT", "DELETE", "DROP",
                                        "UPDATE", "INSERT", "ALTER", "EXEC", "TRUNCATE", "SCRIPT", "CREATE", "DECLARE"]

                sql_injection_patterns.each do |pattern|
                    return true if input.include?(pattern)
                end

                false
            end
        end
    end
end