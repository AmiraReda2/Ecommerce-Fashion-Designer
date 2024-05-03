

export class ApiFeatures{
    constructor(mongooseQuery,searchQuery){
        this.mongooseQuery = mongooseQuery
        this.searchQuery = searchQuery
    }
//! 1- pagination
    pagination(){
        if( this.searchQuery.page <= 0 )  this.searchQuery.page = 1
        let pageNumber =  this.searchQuery.page * 1 || 1
        let pageLimit = 100 
        let skip = ( pageNumber -1 ) * pageLimit 
        this.pageNumber = pageNumber
        this.mongooseQuery.skip(skip).limit(pageLimit)
        return this
    }

//! 2- filter
    filter(){
        
        let filterObj = {...this.searchQuery}
        let excludedFields = ['page','sort', 'fields' , 'keyword']
        excludedFields.forEach(val => {
            delete filterObj[val]
        })
        filterObj = JSON.stringify(filterObj)
        filterObj = filterObj.replace(/(gt|gte|lt|lte)/g , match => '$' + match)
        filterObj = JSON.parse(filterObj)
        this.mongooseQuery.find(filterObj)
        return this
    }

 //! sort 
  sort(){
    if (this.searchQuery.sort){
        let sortBy = this.searchQuery.sort.split(',').join(' ')
        console.log(sortBy)
        this.mongooseQuery.sort(sortBy)
      }
      return this
  }
//! fields
     fields() {
        if (this.searchQuery.fields){
            let fields = this.searchQuery.fields.split(',').join(' ')
            this.mongooseQuery.select(fields)
    }
    return this
}
//! 5- search
    search(){
        if (this.searchQuery.keyword){
            this.mongooseQuery.find({
                $or:[
                    { title:{ $regex: this.searchQuery.keyword } } ,
                    { description:{ $regex: this.searchQuery.keyword } }
                ]
            })
        }
        return this 
    }

}