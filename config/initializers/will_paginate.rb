require 'will_paginate/active_record'
require 'will_paginate/array'

if defined?(WillPaginate)
    module WillPaginate
        module ActiveRecord
            module RelationMethods
                alias_method :per, :per_page
                alias_method :num_pages, :total_pages
            end
        end
    end
end