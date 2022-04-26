var Para = require('../models/para')

module.exports.list = function(){
    return Para.find().exec()
}

module.exports.find = function(id){
    return Para.findById(id).exec()
}

module.exports.insert = function(p){
    var d = new Date()
    p.date = d.toLocaleString()
    var newp = new Para(p)
    return newp.save()
}

module.exports.delete = function(id){
    return Para.findByIdAndDelete(id).exec()
}

module.exports.edit = function(id, p){
    return Para.findOneAndReplace({_id: id}, p).exec()
}