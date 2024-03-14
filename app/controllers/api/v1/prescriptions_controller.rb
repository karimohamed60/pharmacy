class Api::V1::PrescriptionsController < ApiControllerBase
    before_action :set_prescription, only: [:show, :update, :generate_pdf]
    before_action :set_student, only: [:index, :show]

    def index
        @prescriptions = Prescription.where(student_id: params[:student_id])
        authorize @prescriptions

        if @prescriptions.blank?
            render_error("No prescriptions found for this student", :not_found)
        else
            render_success(serialized_prescriptions(@prescriptions), :ok)
        end

    rescue => e
        render_error("An error occurred: #{e.message}", :not_found)
    end

    def show
        authorize @prescription

        if @prescription.blank?
            render_error("No prescription found", :unprocessable_entity)
        else
            render_success(serialized_prescription(@prescription), :ok)
        end
    end

    def update
        authorize @prescription

        if @prescription.update(prescription_params) && update_prescription_medicines
            render_success(serialized_prescription(@prescription), :ok)
        end
    rescue => e
        render_error("An error occurred: #{e.message}", :unprocessable_entity)
    end

    def generate_pdf
        pdf = Api::Pdfs::PrescriptionPdf.new(@prescription)
        send_data pdf.render, filename: "prescription.pdf", type: "application/pdf", disposition: "inline"
    end

    private

    def set_prescription
        if params[:id].present? && params[:id].to_i.positive?
            @prescription = Prescription.where(student_id: params[:student_id], id: params[:id])
            if @prescription.blank?
                raise ActiveRecord::RecordNotFound
            end
        else
            render_error("Invalid parameter: id", :unprocessable_entity)
        end

    rescue ActiveRecord::RecordNotFound
        render_error("Prescription not found.", :not_found) 
    end

    def set_student
        if params[:student_id].present? && params[:student_id].to_i.positive?
            @student = Student.find(params[:student_id])
        else
            render_error("Invalid parameter: id", :unprocessable_entity)
        end

    rescue ActiveRecord::RecordNotFound
        render_error("Student not found.", :not_found) 
    end

    def update_prescription_medicines
        PrescriptionsMedicine.update_prescription_medicines(params[:prescription_medicines], @prescription)
    end

    def serialized_prescription(prescription)
        PrescriptionSerializer.new(prescription)
    end

    def serialized_prescriptions(prescriptions)
        PrescriptionSerializer.new(prescriptions)
    end

    def prescription_params
        params.require(:prescription).permit(:status, prescription_medicines: [:id, :got_medicine])
    end
end