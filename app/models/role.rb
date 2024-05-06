class Role < ApplicationRecord

    self.table_name = "roles"

    has_many :users, class_name: "User"

    def self.ransackable_attributes(auth_object = nil)
        ["id", "role_name"]
    end
end
