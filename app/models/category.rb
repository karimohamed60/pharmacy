class Category < ApplicationRecord

    self.table_name = "categories"

    has_many :medicines, class_name: "Medicine"
end
