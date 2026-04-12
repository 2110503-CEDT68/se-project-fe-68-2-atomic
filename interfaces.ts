interface DentistItem {
	id:string,
  name:string
	yearsOfExperience:number,
	areaOfExpertise:string,
	imageURL:string,
	createdAt:string

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
	count:number,
	pagination: Object,
	data : AnnouncementItem[]
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