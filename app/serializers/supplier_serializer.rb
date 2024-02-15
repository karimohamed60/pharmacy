class SupplierSerializer
  include JSONAPI::Serializer

  attributes :supplier_name, :description, :date
end
