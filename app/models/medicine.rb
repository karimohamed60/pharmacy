class Medicine < ApplicationRecord

    self.table_name = "medicines"

    belongs_to :user, class_name: "User"
    belongs_to :category, class_name: "Category"
    has_many :medicines_suppliers, class_name: "MedicinesSupplier"
    has_many :suppliers, through: :medicines_suppliers, class_name: "Supplier"
    has_many :orders_medicines, class_name: "OrdersMedicine"
    has_many :invoices_medicines, class_name: "InvoicesMedicine"
    has_many :transfers_medicines, class_name: "TransfersMedicine"

    def self.ransackable_attributes(auth_object = nil)
        ["id", "ingredient_name", "commercial_name", "category_id",  "expire_date", "international_barcode",
            "minor_unit", "medium_unit", "major_unit", "price_per_unit", "quantity_in_inventory", "quantity_in_pharmacy",
            "quantity_sold", "user_id", "created_at", "updated_at"]
    end

    def self.ransackable_associations(auth_object = nil)
        ["category", "invoices_medicines", "medicines_suppliers", "orders_medicines", "suppliers", "transfers_medicines", "user"]
    end
end
