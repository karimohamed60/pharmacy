class Category < ApplicationRecord

    self.table_name = "categories"

    has_many :medicines, class_name: "Medicine"

    def self.ransackable_attributes(auth_object = nil)
        ["id", "category_name"]
    end
end
