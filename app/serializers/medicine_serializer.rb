class MedicineSerializer
  include JSONAPI::Serializer

  attributes :id, :ingredient_name, :commercial_name, :international_barcode, :minor_unit, :medium_unit, :major_unit, :price_per_unit,
             :quantity_in_inventory, :quantity_in_pharmacy, :quantity_sold, :expire_date, :created_at, :updated_at, :category, :user

  attribute :user do |object|
    {
      user_id: object.user.id,
      username: object.user.username
    }
  end

  attribute :category do |object|
    {
      category_id:  object.category.id,
      category_name: object.category.category_name
    }
  end
end
