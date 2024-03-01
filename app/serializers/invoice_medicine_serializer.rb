class InvoicesMedicineSerializer
  include JSONAPI::Serializer

  attributes :invoice_id, :medicine_id, :quantity, :discount, :price, :amount

  #belongs_to :user
  #belongs_to 
  belongs_to :invoice
  belongs_to :medicine
end
