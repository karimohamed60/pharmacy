FactoryBot.define do
    factory :role do
        role_name { 'admin' }
    end

    factory :inventory_role, parent: :role do
        role_name { 'inventory' }
    end
end