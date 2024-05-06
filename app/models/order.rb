class Order < ApplicationRecord

    self.table_name = "orders"

    belongs_to :student, class_name: "Student"
    belongs_to :user, class_name: "User"
    has_many :order_medicines, class_name: "OrdersMedicine", dependent: :destroy
    accepts_nested_attributes_for :order_medicines

    validates :student_id, presence: true

    def self.ransackable_attributes(auth_object = nil)
        ["created_at", "id", "student_id", "updated_at", "user_id"]
    end

    def self.ransackable_associations(auth_object = nil)
        ["order_medicines", "student", "user"]
    end

    def check_pharmacy_quantity(order_medicines_attributes)
        order_medicines_attributes.each do |order_medicine|
            medicine = Medicine.find(order_medicine[:medicine_id])
            if medicine.quantity_in_pharmacy < order_medicine[:quantity]
                return false
            else
                return true
            end
        end
    end

    def update_medicine_sold_quantity(order_medicines_attributes)
        order_medicines_attributes.each do |order_medicine|
            medicine = Medicine.find(order_medicine[:medicine_id])
            medicine.update(quantity_sold: medicine.quantity_sold + order_medicine[:quantity])
        end
    end

    def update_medicine_pharmacy_quantity(order_medicines_attributes)
        order_medicines_attributes.each do |order_medicine|
            medicine = Medicine.find(order_medicine[:medicine_id])
            medicine.update(quantity_in_pharmacy: medicine.quantity_in_pharmacy - order_medicine[:quantity])
        end
    end
end
