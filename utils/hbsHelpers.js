const moment = require('moment')

const hbsHelper = (handlebars) => {
   handlebars.registerHelper('paginate', require('handlebars-paginate'))

   handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
   });

   handlebars.registerHelper('sliceTitle', function(passedString) {
      var theString = passedString.substring(0, 149);
        return new handlebars.SafeString(theString)
   });

   handlebars.registerHelper('formatDate', function(dateString) {
      return new handlebars.SafeString(
         moment(dateString).format('DD.MM.YYYY').toUpperCase()
      )
   })

   handlebars.registerHelper('dateFormat', function(dateString) {
      return new handlebars.SafeString(
         moment(dateString).format('YYYY-MM-DD').toUpperCase()
      )
   })
}

module.exports = hbsHelper