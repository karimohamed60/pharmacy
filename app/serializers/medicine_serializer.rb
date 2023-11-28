class MedicineSerializer
  include JSONAPI::Serializer

  attributes :id, :ingredient_name, :commercial_name, :international_barcode, :minor_unit, :medium_unit, :major_unit, :price_per_unit, :quantity_in_inventory, :quantity_in_pharmacy, :quantity_sold, :expire_date, :created_at, :updated_at

  belongs_to :user
  belongs_to :category
  has_many :suppliers
  has_many :orders_medicines
  has_many :invoices_medicines
  has_many :transfers_medicines
end
