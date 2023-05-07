export default {
  LOGIN: {
    SUBTITLE: 'Hệ thống phê duyệt và phát hành văn thư',
    SUBMITTER: {
      SUBMIT_TEXT: 'Đăng nhập',
    },
    USERNAME: {
      PLACEHOLDER: 'Tên đăng nhập',
      RULE_MESSAGE: 'Hãy điền tên đăng nhập!',
    },
    PASSWORD: {
      PLACEHOLDER: 'Mật khẩu',
      RULE_MESSAGE: 'Hãy điền mật khẩu!',
    },
  },
  MAIN_PAGE: {
    MENU: {
      ITEMS: {
        LABEL: 'Văn bản đến',
        INCOMING_DOCUMENT_LIST: 'Danh sách văn bản đến',
        RECEIVING_INCOMING_DOCUMENT: 'Tiếp nhận văn bản đến',
        PROCESSES_INCOMING_DOCUMENT: 'Xử lý văn bản đến',
        OUTGOING_DOCUMENT: 'Văn bản đi',
        INTERNAL_DOCUMENT: 'Văn bản nội bộ',
        users: 'Người dùng',
      },
    },
    BUTTON: {
      REPORT_TO_LEADER: 'Trình lãnh đạo',
    },
  },
  page_header: {
    languages: {
      title: 'Ngôn ngữ',
      en: 'Tiếng Anh',
      vi: 'Tiếng Việt',
    },
    reminder: 'Thông báo',
    document_reminder_status: {
      active: 'Đang chờ xử lý',
      close_to_expiration: 'Sắp hết hạn',
      expired: 'Đã quá hạn',
    },
    logout: {
      title: 'Đăng xuất',
      modal: {
        title: 'Xác nhận',
        ok_text: 'Đăng xuất',
        cancel_text: 'Hủy',
        content: 'Bạn có chắc chắn muốn đăng xuất?',
      },
    },
  },
  common: {
    pagination: {
      show_total: 'Kết quả: {{total}}',
    },
    search_criteria: {
      title: 'Tiêu thức tìm kiếm',
      search: 'Tìm kiếm',
      reset: 'Làm mới',
    },
    button: {
      save: 'Lưu',
      cancel: 'Hủy',
    },
  },
  user: {
    invalid: 'Tài khoản không hợp lệ',
    role: {
      GIAM_DOC: 'Giám đốc',
      CHUYEN_VIEN: 'Chuyên viên',
      TRUONG_PHONG: 'Trưởng phòng',
      VAN_THU: 'Văn thư',
      DOC_ADMIN: 'Quản trị viên',
    },
    detail: {
      title: 'Thông tin người dùng',
      id: 'ID',
      username: 'Tên đăng nhập',
      password: 'Mật khẩu',
      email: 'Email',
      full_name: 'Họ và tên',
      role: 'Vai trò',
      department: 'Phòng ban',
      username_required: 'Hãy điền tên đăng nhập!',
      password_required: 'Hãy điền mật khẩu!',
      full_name_required: 'Hãy điền họ và tên!',
      email_invalid: 'Email không hợp lệ!',
      role_required: 'Hãy chọn vai trò!',
      department_required: 'Hãy chọn phòng ban!',
    },
    username: {
      existed: 'Tên đăng nhập đã tồn tại',
    },
    email: {
      existed: 'Email đã tồn tại',
    },
  },
  SENDING_LEVEL: {
    CITY: 'Thành phố',
    DISTRICT: 'Quận huyện',
    SCHOOL: 'Trường',
  },
  PROCESSING_STATUS: {
    UNPROCESSED: 'Chưa xử lý',
    IN_PROGRESS: 'Đang xử lý',
    CLOSED: 'Đã xử lý',
  },
  search_criteria_bar: {
    incoming_number: 'Số văn bản đến',
    original_symbol_number: 'Số ký hiệu gốc',
    document_type: 'Loại văn bản',
    distribution_organization: 'Cơ quan ban hành',
    arriving_date: 'Ngày đến',
    processing_duration: 'Thời hạn xử lý',
    summary: 'Trích yếu',
    user_management: {
      username: 'Tên đăng nhập',
      email: 'Email',
      full_name: 'Họ và tên',
      role: 'Vai trò',
      department: 'Phòng ban',
    },
  },
  incomingDocListPage: {
    table: {
      columns: {
        id: 'STT',
        issueLevel: 'Cấp gửi',
        type: 'Loại văn bản',
        arriveId: 'Số đến theo sổ',
        originId: 'Số ký hiệu gốc',
        arriveDate: 'Ngày đến',
        issuePlace: 'Nơi phát hành',
        summary: 'Trích yếu',
        fullText: 'Toàn văn',
        status: 'Trạng thái',
        deadline: 'Thời hạn xử lý',
      },
      tooltip: {
        downloadAttachment: 'Tải tệp đính kèm',
      },
    },
    message: {
      attachment: {
        not_found: 'Không có dữ liệu',
        download_success: 'Tải tệp đính kèm thành công',
      },
      selected_docs: {
        unprocessed: 'Chưa xử lý',
        in_progress: 'Đang xử lý',
        closed: 'Đã xử lý',
        summary:
          'Đã chọn {{count}} văn bản ({{unprocessedDocs}} chưa xử lý, {{processingDocs}} đang xử lý, {{closedDocs}} đã xử lý)',
      },
      transfer_success: 'Chuyển văn bản thành công',
    },
  },
  receiveIncomingDocPage: {
    title: 'Tiếp nhận văn bản đến',
    form: {
      docFolder: 'Sổ văn bản',
      docFolderRequired: 'Hãy chọn sổ văn bản',
      documentType: 'Loại văn bản',
      documentTypeRequired: 'Hãy chọn loại văn bản',
      incomingNumber: 'Số đến theo sổ',
      incomingNumberRequired: 'Hãy điền số đến theo sổ',
      folder: 'Hồ sơ công việc',
      folderRequired: 'Hãy chọn hồ sơ công việc',
      originalSymbolNumber: 'Số ký hiệu gốc',
      originalSymbolNumberRequired: 'Hãy điền số ký hiệu gốc',
      distributionOrg: 'Cơ quan ban hành',
      distributionOrgRequired: 'Hãy chọn cơ quan ban hành',
      distributionDate: 'Ngày ban hành',
      distributionDateInvalid: 'Ngày ban hành phải cùng hoặc sớm hơn ngày đến',
      distributionDateGreaterThanNowError: 'Ngày ban hành phải sớm hơn hoặc bằng ngày hiện tại',
      distributionDateRequired: 'Hãy chọn ngày ban hành',
      arrivingDate: 'Ngày đến',
      arrivingDateRequired: 'Hãy chọn ngày đến',
      arrivingDateInvalid: 'Ngày đến phải cùng hoặc sau ngày ban hành',
      arrivingDateGreaterThanNowError: 'Ngày đến phải sớm hơn hoặc bằng ngày hiện tại',
      arrivingTime: 'Giờ đến',
      arrivingTimeRequired: 'Hãy chọn giờ đến',
      summary: 'Trích yếu',
      summaryRequired: 'Hãy điền trích yếu',
      signer: 'Người ký',
      signerRequired: 'Hãy chọn người ký',
      signerTitle: 'Chức vụ',
      signerTitleRequired: 'Hãy điền chức vụ',
      confidentiality: 'Độ mật',
      confidentialityRequired: 'Hãy chọn độ mật',
      urgency: 'Độ khẩn',
      urgencyRequired: 'Hãy chọn độ khẩn',
      files: 'Tài liệu đính kèm',
      filesRequired: 'Hãy chọn tài liệu đính kèm',
      fileHelper: 'Bấm hoặc kéo thả tệp vào đây để tải lên',
      button: {
        save: 'Hoàn tất',
        cancel: 'Hủy bỏ',
      },
      message: {
        fileError: 'đính kèm không thành công.',
        fileSuccess: 'đã được đính kèm',
        fileMaxCountError: 'Chỉ có thể đính kèm tối đa 3 tệp',
        fileTypeError: 'Chỉ có thể đính kèm các tệp có định dạng .pdf, .jpg, .jpeg, .png',
        fileSizeError: 'Kích thước tệp không được vượt quá 3MB',
        fileDuplicateError: 'Tệp đã được đính kèm',
        success: 'Tiếp nhận văn bản thành công',
        error: 'Đã có lỗi xảy ra, vui lòng thử lại.',
      },
    },
  },

  incomingDocDetailPage: {
    title: 'Chi tiết văn bản đến',
    form: {
      docFolder: 'Sổ văn bản',
      docFolderRequired: 'Hãy chọn sổ văn bản',
      documentType: 'Loại văn bản',
      documentTypeRequired: 'Hãy chọn loại văn bản',
      incomingNumber: 'Số đến theo sổ',
      incomingNumberRequired: 'Hãy điền số đến theo sổ',
      folder: 'Hồ sơ công việc',
      folderRequired: 'Hãy chọn hồ sơ công việc',
      originalSymbolNumber: 'Số ký hiệu gốc',
      originalSymbolNumberRequired: 'Hãy điền số ký hiệu gốc',
      distributionOrg: 'Cơ quan ban hành',
      distributionOrgRequired: 'Hãy chọn cơ quan ban hành',
      distributionDate: 'Ngày ban hành',
      distributionDateInvalid: 'Ngày ban hành phải cùng hoặc sớm hơn ngày đến',
      distributionDateGreaterThanNowError: 'Ngày ban hành phải sớm hơn hoặc bằng ngày hiện tại',
      distributionDateRequired: 'Hãy chọn ngày ban hành',
      arrivingDate: 'Ngày đến',
      arrivingDateRequired: 'Hãy chọn ngày đến',
      arrivingDateInvalid: 'Ngày đến phải cùng hoặc sau ngày ban hành',
      arrivingDateGreaterThanNowError: 'Ngày đến phải sớm hơn hoặc bằng ngày hiện tại',
      arrivingTime: 'Giờ đến',
      arrivingTimeRequired: 'Hãy chọn giờ đến',
      summary: 'Trích yếu',
      summaryRequired: 'Hãy điền trích yếu',
      signer: 'Người ký',
      signerRequired: 'Hãy chọn người ký',
      signerTitle: 'Chức vụ',
      signerTitleRequired: 'Hãy điền chức vụ',
      confidentiality: 'Độ mật',
      confidentialityRequired: 'Hãy chọn độ mật',
      urgency: 'Độ khẩn',
      urgencyRequired: 'Hãy chọn độ khẩn',
      files: 'Tài liệu đính kèm',
      filesRequired: 'Hãy chọn tài liệu đính kèm',
      fileHelper: 'Bấm hoặc kéo thả tệp vào đây để tải lên',
    },
    button: {
      collect: 'Thu thập',
      edit: 'Chỉnh sửa',
      save: 'Lưu chỉnh sửa',
      process: 'Xử lý văn bản',
      transfer: 'Chuyển xử lý',
      assign: 'Phân công',
      comment: 'Góp ý văn bản',
      confirm: 'Xác nhận đã xem',
      return: 'Trả lại',
      extend: 'Yêu cầu gia hạn',
    },
    message: {
      fileError: 'đính kèm không thành công.',
      fileSuccess: 'đã được đính kèm',
      success: 'Chỉnh sửa văn bản thành công',
      error: 'Đã có lỗi xảy ra, vui lòng thử lại.',
    },
    comment: {
      title: 'Góp ý văn bản',
      button: {
        title: 'Góp ý',
      },
    },
  },
  transfer_modal: {
    title: 'Luân chuyển văn bản tới',
    document_number: 'Văn bản số  {{id}}',
    director_view: {
      sender: 'Người chuyển',
      implementation_date: 'Ngày thực hiện',
      document: 'Văn bản',
      summary: 'Trích yếu - đề nghị',
      assignee: 'Người nhận',
      collaborators: 'Người tham gia',
    },
    secretary_view: {
      processing_time: 'Hạn xử lý',
      is_infinite_processing_time: 'Không thời hạn',
    },
    manager_view: {
      process_method: 'Cách thức xử lý',
    },
    sidebar: {
      director: 'Ban giám đốc',
      chief_of_office: 'Chánh văn phòng',
      secretary: 'Văn thư',
    },
    form: {
      assignee_required: 'Hãy chọn người nhận',
      processing_time_required: 'Hãy chọn hạn xử lý',
      processing_time_invalid: 'Hạn xử lý không hợp lệ',
      processing_time_infinite: 'Không thời hạn',
      collaborators_required: 'Hãy chọn người tham gia',
      collaborator_can_not_has_same_value_with_assignee:
        'Người tham gia không được trùng với người nhận',
      only_unprocessed_docs_can_be_transferred_to_director:
        'Chỉ có thể chuyển văn bản chưa xử lý tới Ban Giám đốc',
      only_in_progress_docs_can_be_transferred_to_manager_or_secretary:
        'Chỉ có thể chuyển văn bản đang xử lý tới Chánh văn phòng hoặc Văn thư',
    },
  },
  internal_server_error_page: {
    title: 'Lỗi máy chủ',
    message: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
    go_back_button: 'Quay lại',
  },
  error: {
    file: {
      file_already_existed: 'Tệp đã tồn tại',
      file_type_not_accepted: 'Loại tệp không được hỗ trợ',
    },
  },
  user_management: {
    table: {
      column: {
        id: 'ID',
        username: 'Tên người dùng',
        email: 'Email',
        full_name: 'Họ và tên',
        role: 'Vai trò',
        department: 'Phòng ban',
      },
    },
    button: {
      add_user: 'Thêm người dùng',
      delete_user: 'Xóa người dùng',
    },
  },
  processing_detail_page: {
    title: 'Chi tiết xử lý',
    table: {
      column: {
        step: 'Bước',
        incoming_number: 'Số đến',
        full_name: 'Tên người xử lý',
        department: 'Phòng ban',
        role: 'Vai trò',
      },
    },
  },
  processing_user_role: {
    REPORTER: 'Người gửi',
    ASSIGNEE: 'Người nhận',
    COLLABORATOR: 'Người tham gia',
  },
};
