FactoryBot.define do
    factory :user do
        username  { 'karimohamed' }
        full_name { 'Karim Mohamed Mahmoud' }
        role      { association :role, role_name: 'inventory' }
        password  { '123456789' }
        
    end
end