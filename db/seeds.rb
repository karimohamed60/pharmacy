# Helper method to create a random barcode
def generate_barcode
  rand(10**12).to_s.rjust(13, '0')
end

# Seed data for 10 fake medicines
10.times do
  Medicine.create!(
    ingredient_name: Faker::Food.ingredient,
    commercial_name: Faker::Commerce.product_name,
    international_barcode: generate_barcode,
    minor_unit: Faker::Food.metric_measurement,
    medium_unit: Faker::Food.metric_measurement,
    major_unit: Faker::Food.metric_measurement,
    price_per_unit: Faker::Commerce.price(range: 1..100.0, as_string: true),
    quantity_in_inventory: Faker::Number.between(from: 0, to: 100),
    quantity_in_pharmacy: Faker::Number.between(from: 0, to: 100),
    quantity_sold: Faker::Number.between(from: 0, to: 50),
    expire_date: Faker::Date.forward(days: 365),
    user_id: 1, 
    category_id: 1
  )
end
# Seed data for 5 fake suppliers
5.times do
  Supplier.create(
    supplier_name: Faker::Company.name,
    description: Faker::Lorem.sentence,
    user_id: 1,
    date: Faker::Date.backward(days: 365)
  )
end 