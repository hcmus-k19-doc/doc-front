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
        PROCESSES_INCOMING_DOCUMENT: 'Xử lý văn bản đến',
        OUTGOING_DOCUMENT: 'Văn bản đi',
        INTERNAL_DOCUMENT: 'Văn bản nội bộ',
      },
    },
    BUTTON: {
      REPORT_TO_LEADER: 'Trình lãnh đạo',
    },
  },
  PAGE_HEADER: {
    LANGUAGES: {
      EN: 'Tiếng Anh',
      VI: 'Tiếng Việt',
    },
  },
  COMMON: {
    PAGINATION: {
      SHOW_TOTAL: 'Kết quả: {{total}} văn bản',
    },
    SEARCH_CRITERIA: {
      TITLE: 'Tiêu thức tìm kiếm',
      SEARCH: 'Tìm kiếm',
      RESET: 'Làm mới',
    },
  },
  USER: {
    INVALID: 'Tài khoản không hợp lệ',
  },
  SENDING_LEVEL: {
    CITY: 'Thành phố',
    DISTRICT: 'Quận huyện',
    SCHOOL: 'Trường',
  },
  DOCUMENT_TYPE: {
    CONTRACT: 'Hợp đồng',
    INSTRUCTION: 'Công văn',
    INVOICE: 'Hóa đơn',
    LETTER: 'Thư',
    PAYMENT: 'Phiếu chi',
    RECEIPT: 'Phiếu thu',
    OTHER: 'Khác',
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
  },

  procesIncomingDocPage: {
    title: 'Tiếp nhận văn bản đến',
    form: {
      docFolder: 'Sổ văn bản',
      docFolderRequired: 'Hãy chọn sổ văn bản',
      docType: 'Loại văn bản',
      docTypeRequired: 'Hãy chọn loại văn bản',
      docNumber: 'Số đến theo sổ',
      docNumberRequired: 'Hãy điền số đến theo sổ',
      folder: 'Hồ sơ công việc',
      folderRequired: 'Hãy chọn hồ sơ công việc',
      originalSymbolNumber: 'Số ký hiệu gốc',
      originalSymbolNumberRequired: 'Hãy điền số ký hiệu gốc',
      distributionOrg: 'Cơ quan ban hành',
      distributionOrgRequired: 'Hãy chọn cơ quan ban hành',
      distributionDate: 'Ngày ban hành',
      distributionDateRequired: 'Hãy chọn ngày ban hành',
      arrivingDate: 'Ngày đến',
      arrivingDateRequired: 'Hãy chọn ngày đến',
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
        success: 'Tiếp nhận văn bản thành công',
      },
    },
  },
  incomingDocDetailPage: {
    title: 'Chi tiết văn bản đến',
    form: {
      docFolder: 'Sổ văn bản',
      docFolderRequired: 'Hãy chọn sổ văn bản',
      docType: 'Loại văn bản',
      docTypeRequired: 'Hãy chọn loại văn bản',
      docNumber: 'Số đến theo sổ',
      docNumberRequired: 'Hãy điền số đến theo sổ',
      folder: 'Hồ sơ công việc',
      folderRequired: 'Hãy chọn hồ sơ công việc',
      originalSymbolNumber: 'Số ký hiệu gốc',
      originalSymbolNumberRequired: 'Hãy điền số ký hiệu gốc',
      distributionOrg: 'Cơ quan ban hành',
      distributionOrgRequired: 'Hãy chọn cơ quan ban hành',
      distributionDate: 'Ngày ban hành',
      distributionDateRequired: 'Hãy chọn ngày ban hành',
      arrivingDate: 'Ngày đến',
      arrivingDateRequired: 'Hãy chọn ngày đến',
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
      message: {
        fileError: 'đính kèm không thành công.',
        fileSuccess: 'đã được đính kèm',
        success: 'Tiếp nhận văn bản thành công',
      },
    },
    button: {
      collect: 'Thu thập',
      edit: 'Chỉnh sửa',
      process: 'Xử lý văn bản',
      transfer: 'Chuyển xử lý',
      assign: 'Phân công',
      comment: 'Góp ý văn bản',
      confirm: 'Xác nhận đã xem',
      return: 'Trả lại',
      extend: 'Yêu cầu gia hạn',
    },
  },
};
