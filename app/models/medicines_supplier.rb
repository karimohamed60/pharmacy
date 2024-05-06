class MedicinesSupplier < ApplicationRecord

    self.table_name = "medicines_suppliers"

    belongs_to :medicine, class_name: "Medicine"
    belongs_to :supplier, class_name: "Supplier"

    def self.ransackable_attributes(auth_object = nil)
        ["id", "medicine_id", "supplier_id"]
    end
end
