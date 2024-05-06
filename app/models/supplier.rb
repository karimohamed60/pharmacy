class Supplier < ApplicationRecord

    self.table_name = "suppliers"

    belongs_to :user, class_name: "User"
    has_many :invoices, class_name: "Invoice"
    has_many :medicines_suppliers, class_name: "MedicinesSupplier"
    has_many :medicines, through: :medicines_suppliers, class_name: "Medicine"

    def self.ransackable_attributes(auth_object = nil)
        ["id", "supplier_name", "description", "user_id", "date"]
    end

    def self.ransackable_associations(auth_object = nil)
        ["invoices", "medicines", "medicines_suppliers", "user"]
    end
end
