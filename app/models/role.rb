class Role < ApplicationRecord

    self.table_name = "roles"

    has_many :users, class_name: "User"
end
