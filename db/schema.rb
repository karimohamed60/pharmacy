# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_03_14_010102) do
  create_table "categories", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "category_name", limit: 20, null: false
  end

  create_table "invoices", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "order_number", limit: 100, null: false
    t.string "comments", null: false
    t.float "total_amount", default: 0.0, null: false
    t.bigint "user_id"
    t.bigint "supplier_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["id"], name: "index_invoices_on_invoice_id", unique: true
    t.index ["order_number"], name: "index_invoices_on_order_number", unique: true
    t.index ["supplier_id"], name: "index_invoices_on_supplier_id"
    t.index ["user_id"], name: "index_invoices_on_user_id"
  end

  create_table "invoices_medicines", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "invoice_id"
    t.bigint "medicine_id"
    t.integer "quantity", null: false
    t.decimal "discount", precision: 3, scale: 2, default: "0.0", null: false
    t.float "price", null: false
    t.float "amount", null: false
    t.index ["invoice_id"], name: "index_invoices_medicines_on_invoice_id"
    t.index ["medicine_id"], name: "index_invoices_medicines_on_medicine_id"
  end

  create_table "medicines", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "ingredient_name", limit: 100, null: false
    t.string "commercial_name", limit: 100, null: false
    t.binary "international_barcode", limit: 13, null: false
    t.string "minor_unit", limit: 20, null: false
    t.string "medium_unit", limit: 20, null: false
    t.string "major_unit", limit: 20, null: false
    t.decimal "price_per_unit", precision: 4, scale: 2, null: false
    t.integer "quantity_in_inventory", default: 0, null: false
    t.integer "quantity_in_pharmacy", default: 0, null: false
    t.integer "quantity_sold", default: 0
    t.date "expire_date", null: false
    t.bigint "user_id"
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_medicines_on_category_id"
    t.index ["commercial_name"], name: "index_medicines_on_commercial_name"
    t.index ["ingredient_name"], name: "index_medicines_on_ingredient_name"
    t.index ["international_barcode"], name: "index_medicines_on_international_barcode"
    t.index ["user_id"], name: "index_medicines_on_user_id"
  end

  create_table "medicines_suppliers", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "medicine_id"
    t.bigint "supplier_id"
    t.index ["medicine_id", "supplier_id"], name: "index_unique_medicine_and_supplier", unique: true
    t.index ["medicine_id"], name: "index_medicines_suppliers_on_medicine_id"
    t.index ["supplier_id"], name: "index_medicines_suppliers_on_supplier_id"
  end

  create_table "orders", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "student_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["id"], name: "index_orders_on_order_id", unique: true
    t.index ["student_id"], name: "index_orders_on_student_id"
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "orders_medicines", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "order_id"
    t.bigint "medicine_id"
    t.integer "quantity", null: false
    t.index ["medicine_id"], name: "index_orders_medicines_on_medicine_id"
    t.index ["order_id", "medicine_id"], name: "index_unique_order_medicine", unique: true
    t.index ["order_id"], name: "index_orders_medicines_on_order_id"
  end

  create_table "prescriptions", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "student_id"
    t.integer "status", default: 0
    t.date "date", null: false
    t.index ["student_id"], name: "index_prescriptions_on_student_id"
  end

  create_table "prescriptions_medicines", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "prescription_id"
    t.string "medicine_name", limit: 100, null: false
    t.string "dosage", limit: 200, null: false
    t.integer "got_medicine", default: 3
    t.integer "quantity", default: 0
    t.index ["prescription_id"], name: "index_prescriptions_medicines_on_prescription_id"
  end

  create_table "roles", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "role_name", limit: 20, null: false
  end

  create_table "salaf_requests", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "medicine_name", limit: 200, null: false
    t.integer "status", default: 1
    t.bigint "student_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["status"], name: "index_salaf_requests_on_status"
    t.index ["student_id"], name: "index_salaf_requests_on_student_id"
  end

  create_table "students", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "student_national_id"
    t.string "student_name", limit: 120, null: false
    t.index ["id"], name: "index_students_on_students_id", unique: true
    t.index ["student_national_id"], name: "index_students_on_student_national_id", unique: true
  end

  create_table "suppliers", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "supplier_name", limit: 100, null: false
    t.string "description", limit: 200, null: false
    t.bigint "user_id"
    t.date "date"
    t.index ["supplier_name"], name: "index_suppliers_on_supplier_name"
    t.index ["user_id"], name: "index_suppliers_on_user_id"
  end

  create_table "transfers", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "status", default: 0
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["status"], name: "index_transfers_on_status"
    t.index ["user_id"], name: "index_transfers_on_user_id"
  end

  create_table "transfers_medicines", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "transfer_id"
    t.bigint "medicine_id"
    t.integer "quantity", null: false
    t.index ["medicine_id"], name: "index_transfers_medicines_on_medicine_id"
    t.index ["transfer_id"], name: "index_transfers_medicines_on_transfer_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "username", null: false
    t.string "full_name", limit: 70, null: false
    t.string "encrypted_password", default: "", null: false
    t.boolean "active", default: true
    t.datetime "remember_created_at"
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.bigint "role_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti", null: false
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.integer "sign_in_count", default: 0, null: false
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["role_id"], name: "index_users_on_role_id"
    t.index ["username"], name: "index_users_on_user_id", unique: true
  end

  add_foreign_key "invoices", "suppliers"
  add_foreign_key "invoices", "users"
  add_foreign_key "invoices_medicines", "invoices"
  add_foreign_key "invoices_medicines", "medicines"
  add_foreign_key "medicines", "categories"
  add_foreign_key "medicines", "users"
  add_foreign_key "medicines_suppliers", "medicines"
  add_foreign_key "medicines_suppliers", "suppliers"
  add_foreign_key "orders", "students"
  add_foreign_key "orders", "users"
  add_foreign_key "orders_medicines", "medicines"
  add_foreign_key "orders_medicines", "orders"
  add_foreign_key "prescriptions", "students"
  add_foreign_key "prescriptions_medicines", "prescriptions"
  add_foreign_key "salaf_requests", "students"
  add_foreign_key "suppliers", "users"
  add_foreign_key "transfers", "users"
  add_foreign_key "transfers_medicines", "medicines"
  add_foreign_key "transfers_medicines", "transfers"
  add_foreign_key "users", "roles"
end
