class InvoiceSerializer
  include JSONAPI::Serializer

  attributes :id, :order_number, :comments, :total_amount, :created_at, :updated_at

  attribute :supplier do |object|
    {
      supplier_id:  object.supplier.id,
      supplier_name: object.supplier.supplier_name
    }
  end

  attribute :medicines do |object|
    object.invoices_medicines.map do |invoice_medicine|
      {
        medicine_id: invoice_medicine.medicine_id,
        medicine_name: invoice_medicine.medicine.commercial_name,
        quantity: invoice_medicine.quantity,
        discount: invoice_medicine.discount,
        price: invoice_medicine.price,
        amount: invoice_medicine.amount
      }
    end
  end
end
