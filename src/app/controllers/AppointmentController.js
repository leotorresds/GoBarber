const { User, Appointment } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

class AppointmentController {
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)
    return res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date
    })

    res.redirect('/app/dashboard')
  }

  async show (req, res) {
    const date = moment().date(25)
    const appointments = await Appointment.findAll({
      include: [{ model: User }],
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      },
      order: [['date', 'ASC']]
    })

    return res.render('appointments/show', { appointments })
  }
}

module.exports = new AppointmentController()
