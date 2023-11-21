class AddCoreTables < ActiveRecord::Migration[7.0]
  def change
    create_table :roles do |t|
      t.string :role_name, limit: 20, null: false
    end

    create_table :users do |t|
      ## Database authenticatable
      t.string :username, null: false, unique: true
      t.string :full_name, limit: 70, null: false
      t.string :encrypted_password, null: false, default: ""
      t.boolean :active, default: true
      t.datetime :remember_created_at
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at

      t.references :role, foreign_key: true
      t.timestamps null: false
    end

    add_index(:users, [:username], name: "index_users_on_user_id", unique: true)
    
    create_table :categories do |t|
      t.string :category_name, limit: 20, unique: true, null: false
    end

    create_table :medicines do |t|
      t.string :ingredient_name, limit: 100, null: false
      t.string :commercial_name, limit: 100, null: false
      t.binary :international_barcode, limit: 13, null: false
      t.string :minor_unit, limit: 20, null: false
      t.string :medium_unit, limit: 20, null: false
      t.string :major_unit, limit: 20, null: false
      t.decimal :price_per_unit, precision: 4, scale: 2, null: false
      t.integer :quantity_in_inventory, default: 0, null: false
      t.integer :quantity_in_pharmacy, default:0, null: false
      t.integer :quantity_sold, default: 0
      t.date :expire_date, null: false
      
      t.references :user, foreign_key: true
      t.references :category, foreign_key: true
      t.timestamps
    end

    add_index(:medicines, [:ingredient_name], name: 'index_medicines_on_ingredient_name')
    add_index(:medicines, [:commercial_name], name: 'index_medicines_on_commercial_name')
    add_index(:medicines, [:international_barcode], name: 'index_medicines_on_international_barcode')

    create_table :suppliers do |t|
      t.string :supplier_name, limit: 100, null: false
      t.string :description, limit: 200, null: false
      
      t.references :user, foreign_key: true
      t.date :date
    end

    add_index(:suppliers, [:supplier_name], name: 'index_suppliers_on_supplier_name')

    create_table :medicines_suppliers do |t|
      t.references :medicine, foreign_key: true
      t.references :supplier, foreign_key: true
    end

    add_index(:medicines_suppliers, [:medicine_id, :supplier_id], name: 'index_unique_medicine_and_supplier', unique: true)

    create_table :invoices do |t|
      t.string :order_number, limit: 100, null: false
      t.string :comments, limit: 255, null: false
      t.decimal :total_amount, precision: 5, scale: 2, null: false

      t.references :user, foreign_key: true
      t.references :supplier, foreign_key: true
      t.timestamps
    end

    add_index(:invoices, [:id], name: 'index_invoices_on_invoice_id', unique: true)
    add_index(:invoices, [:order_number], name: 'index_invoices_on_order_number', unique: true)

    create_table :invoices_medicines do |t|
      t.references :invoice, foreign_key: true
      t.references :medicine, foreign_key: true

      t.integer :quantity, null: false
      t.decimal :discount, precision: 3, scale: 2, null: false, default: 0
      t.float :price, precision: 5, scale: 2, null: false
      t.float :amount, precision: 7, scale: 2, null: false
    end

    create_table :transfers do |t|
      t.integer :status, default: '2'

      t.references :user, foreign_key: true
      t.timestamps
    end

    add_index(:transfers, [:status], name: 'index_transfers_on_status')

    create_table :transfers_medicines do |t|
      t.references :transfer, foreign_key: true
      t.references :medicine, foreign_key: true
      t.integer :quantity, null: false
    end

    create_table :students  do |t|
      t.bigint :student_national_id
      t.string :student_name, limit: 120, null: false
    end

    add_index(:students, [:id], name: 'index_students_on_students_id', unique: true)
    add_index(:students, [:student_national_id], name: 'index_students_on_student_national_id', unique: true)

    create_table :prescriptions do |t|
      t.references :student, foreign_key: true
      t.integer :status, default: '0'
      t.date :date, null: false
    end

    create_table :prescriptions_medicines do |t|
      t.references :prescription, foreign_key: true
      t.string :medicine_name, limit: 100, null: false
      t.string :dosage, limit: 200, null: false
      t.integer :got_medicine, default: '3'
    end
    
    create_table :orders do |t|
      t.references :student, foreign_key: true
      t.references :user, foreign_key: true
      t.timestamps
    end

    add_index(:orders, [:id], name: 'index_orders_on_order_id', unique: true)

    create_table :orders_medicines do |t|
      t.references :order, foreign_key: true
      t.references :medicine, foreign_key: true
      t.integer :quantity, null: false
    end

    add_index(:orders_medicines, [:order_id, :medicine_id], name: 'index_unique_order_medicine', unique: true)

    create_table :salaf_requests do |t|
      t.string :medicine_name, limit: 200, null: false
      t.integer :status, default: 1 
 
      t.references :student, foreign_key: true
      t.timestamps
    end

    add_index(:salaf_requests, [:status], name: 'index_salaf_requests_on_status')
  end
end