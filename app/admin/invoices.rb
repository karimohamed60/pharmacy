ActiveAdmin.register Invoice do
  permit_params :comments, :order_number, :supplier_id, :user_id, invoices_medicines_attributes: [:id, :medicine_id, :quantity, :discount, :price, :amount, :_destroy]

  controller do
    def create
      resource = Invoice.new(permitted_params[:invoice])

      resource.invoices_medicines.each do |invoice_medicine|
        total_amount = invoice_medicine.price * invoice_medicine.quantity
        discount_amount = total_amount * (invoice_medicine.discount / 100.0)  # Calculate the discount amount (1% of total)
        amount = total_amount - discount_amount
        invoice_medicine.amount = amount
      end

      resource.update_total_amount(resource.invoices_medicines, resource)
      resource.update_medicines_inventory_quantity(resource.invoices_medicines)

      if resource.save
        flash[:notice] = "Invoice was successfully created."
        redirect_to admin_invoices_url
      end

    rescue StandardError
      flash[:error] = "Error while creating Invoice."
      redirect_to new_admin_invoice_url
    rescue ActiveRecord::RecordNotUnique
      flash[:error] = "Order number already exists"
      redirect_to new_admin_invoice_url
    end

    def update
      resource = Invoice.find(params[:id])

      resource.assign_attributes(permitted_params[:invoice])

      if permitted_params[:invoice][:invoices_medicines_attributes].present?
        resource.invoices_medicines_attributes = permitted_params[:invoice][:invoices_medicines_attributes]
      end

      medicine_changed = resource.invoices_medicines.any? do |invoice_medicine|
        invoice_medicine.changed?
      end

      if resource.changed? || medicine_changed
        resource.invoices_medicines.each do |invoice_medicine|
          invoice = InvoicesMedicine.find(invoice_medicine.id)
          previous_qunatity = invoice.quantity

          Medicine.update(invoice.medicine_id, quantity_in_inventory: invoice.medicine.quantity_in_inventory + invoice_medicine.quantity - previous_qunatity)

          total_amount = invoice_medicine.price * invoice_medicine.quantity
          discount_amount = total_amount * (invoice_medicine.discount / 100.0)  # Calculate the discount amount (1% of total)
          amount = total_amount - discount_amount
          invoice_medicine.amount = amount
        end

        resource.update_total_amount(resource.invoices_medicines, resource)

        if resource.save
          flash[:notice] = "Invoice was successfully updated."
          redirect_to admin_invoice_url(resource)
        end
      else
        flash[:notice] = "No changes detected."
        redirect_to admin_invoice_url(resource)
      end

    rescue StandardError
      flash[:error] = "Error while updating Invoice."
      redirect_to edit_admin_invoice_url(resource)
    end
  end

  index do
    selectable_column
    id_column
    column :order_number
    column :supplier
    column :total_amount
    column :created_at
    actions
  end

  show do
    attributes_table do
      row :order_number
      row :supplier
      row :user
      row :created_at
      row :updated_at
      row :medicines do |resource|
        table_for resource.invoices_medicines do
          column "Medicine" do |invoice_medicine|
            invoice_medicine.medicine.commercial_name
          end
          column :quantity
          column :discount
          column :price
          column :amount
        end
      end
      row :total_amount
      row :comments
    end
  end

  filter :order_number
  filter :user, as: :select, collection: User.all.collect { |user| [user.username, user.id] }
  filter :supplier, as: :select, collection: Supplier.all.collect { |supplier| [supplier.supplier_name, supplier.id] }
  filter :total_amount
  filter :created_at

  form do |f|
    f.inputs "Invoice Details" do
      f.input :order_number
      f.input :supplier, as: :select, collection: Supplier.order(supplier_name: :asc).pluck(:supplier_name, :id)
      f.input :user, as: :select, collection: User.all.collect { |user| [user.username, user.id] }

      f.has_many :invoices_medicines, heading: 'Medicines', new_record: 'Add Medicine' do |medicine|
        medicine.input :medicine, as: :select, collection: Medicine.order(commercial_name: :asc).pluck(:commercial_name, :id)
        medicine.input :quantity
        medicine.input :discount
        medicine.input :price
        medicine.input :amount, input_html: { value: 0, readonly: true }, as: :hidden
      end
      f.input :comments
    end
    f.actions
  end
end
