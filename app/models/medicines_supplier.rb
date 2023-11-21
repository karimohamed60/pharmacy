class MedicinesSupplier < ApplicationRecord

    self.table_name = "medicines_suppliers"

    belongs_to :medicine, class_name: "Medicine"
    belongs_to :supplier, class_name: "Supplier"
end
