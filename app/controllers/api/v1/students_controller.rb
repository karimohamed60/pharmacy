class Api::V1::StudentsController < ApiControllerBase
    before_action :set_student, only: [:show]

    def index
        @students = Student.paginate(page: params[:page], per_page: params[:per_page])
        authorize @students

        if @students.blank?
            render_error("No students found", :not_found)
        else
            render_success(serialized_students(@students), :ok, total_students: Student.count)
        end

    rescue => e
        render_error("An error occurred: #{e.message}", :not_found)
    end

    def show
        authorize @student
        render_success(serialized_student(@student), :ok)
    end

    def search
        if params[:q].present?
            if Api::Validators::ParametersValidator.validate_search_params?(params[:q])
                render_error("Invalid parameters.", :bad_request) 
            else
                search_query = "%#{params[:q]}%"
                @students = Student.where("student_national_id LIKE ?", search_query)
                render_success(serialized_students(@students), :ok, total_students: @students.count)
            end
        else
            render_error('Parameter "q" is required.', :bad_request)
        end
    end

    private

    def set_student
        if params[:id].present? && params[:id].to_i.positive?
            @student = Student.find(params[:id])
        else
            render_error("Invalid parameter: id", :unprocessable_entity)
        end

    rescue ActiveRecord::RecordNotFound
        render_error("Student not found.", :not_found) 
    end

    def serialized_student(student)
        StudentSerializer.new(student)
    end

    def serialized_students(students)
        StudentSerializer.new(students)
    end
end