interface DentistItem {
	id:string,
  name:string
	yearsOfExperience:number,
	areaOfExpertise:string,
	imageURL:string,
	createdAt:string,
  averageRating: number
}
interface DentistJson {
	success:boolean,
	count:number,
	pagination: Object,
	data : DentistItem[]
}

interface DentistJsonSingle {
	success:boolean,
	data:DentistItem
}

interface BookingItem {
	_id:string,
	user:{
		name: string,
		telephone: string,
		email: string
	},
	dentist:DentistItem,
	date:string
}
interface BookingJson {
	success:boolean,
	count:number,
	data: BookingItem[]
}

interface BookingJsonSingle {
	success:boolean,
	data: BookingItem
}

interface AnnouncementJson {
	success:boolean,
  total: number,
	count:number,
	pagination: {
		next: {
			page: number,
			limit: number
		}
	},
	data : AnnouncementItem[]
}

interface AnnouncementJsonSingle {
	success:boolean,
	data:AnnouncementItem
}

interface AnnouncementItem {
  _id: string;               
  author: {
		_id: string;
		name: string;
		email: string;
	}
  title: string;
  description: string;
  logoURL: string;
  bannerURL: string;
  isEdited: boolean;
  createdAt: Date | string;   
}

interface ReviewItem {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  dentist: {
    _id: string;
    name: string;
  };
  rating: number;
  title: string;
  comment: string;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt?: Date | string;
  createdAt: Date | string;
}

interface ReviewJson {
  success: boolean;
  total: number;
  count: number;
  pagination: {
    total?: number;
    next?: {
      page: number;
      limit: number;
    };
    prev?: {
      page: number;
      limit: number;
    };
  } | Object;
  data: ReviewItem[];
}

interface ReviewJsonSingle {
  success: boolean;
  data: ReviewItem;
}