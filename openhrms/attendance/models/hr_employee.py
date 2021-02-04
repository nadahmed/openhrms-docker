from odoo import models, api

class HrEmployee(models.Model):
    _inherit = "hr.employee"
    
    @api.multi
    def tooltip_data(self): 
        attend_id = self.env['hr.attendance'].search([('employee_id','=',self.id)], limit=1)
        if attend_id:
            if attend_id.check_in:
                return attend_id.check_in
        else:
            return False
        
        
    
    