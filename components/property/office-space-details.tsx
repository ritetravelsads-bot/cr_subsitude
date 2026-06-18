'use client'

import { 
  Building2, 
  Users, 
  Clock, 
  DollarSign, 
  CheckCircle2,
  Wifi,
  Coffee,
  Shield,
  Mail,
  Car,
  PhoneCall,
  Monitor
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SeatConfiguration {
  type: string
  capacity?: number
  count?: number
  price_per_seat?: number
  price_type?: string
  amenities?: string[]
}

interface OfficeSpaceData {
  space_type?: string
  total_seats?: number
  available_seats?: number
  cabin_count?: number
  available_cabins?: number
  desk_count?: number
  meeting_rooms_count?: number
  seat_configurations?: SeatConfiguration[]
  pricing_model?: string
  lease_term_min?: number
  lease_term_max?: number
  price_per_seat_monthly?: number
  price_per_seat_daily?: number
  price_per_cabin_monthly?: number
  meeting_room_hourly_rate?: number
  office_amenities?: string[]
  access_hours?: string
  custom_access_hours?: string
  reception_available?: boolean
  mail_handling?: boolean
  parking_included?: boolean
  pantry_cafeteria?: boolean
  flexible_terms?: boolean
  minimum_commitment?: string
  notice_period?: string
  building_grade?: string
  fit_out_status?: string
}

interface CommercialLeaseData {
  lease_type?: string
  rent_per_sqft?: number
  rent_escalation?: string
  cam_charges?: number
  security_deposit_months?: number
  fit_out_allowance?: number
  rent_free_period?: string
  lock_in_period_months?: number
  agreement_duration_years?: number
}

interface OfficeSpaceDetailsProps {
  officeSpace?: OfficeSpaceData
  commercialLease?: CommercialLeaseData
  className?: string
}

const SPACE_TYPE_LABELS: Record<string, string> = {
  coworking: 'Coworking Space',
  managed_office: 'Managed Office',
  private_office: 'Private Office',
  virtual_office: 'Virtual Office',
  hot_desk: 'Hot Desk',
  dedicated_desk: 'Dedicated Desk',
  meeting_room: 'Meeting Room',
  training_room: 'Training Room',
}

const SEAT_TYPE_LABELS: Record<string, string> = {
  hot_desk: 'Hot Desk',
  dedicated_desk: 'Dedicated Desk',
  open_desk: 'Open Desk',
  private_cabin: 'Private Cabin',
  team_cabin: 'Team Cabin',
  manager_cabin: 'Manager Cabin',
  executive_cabin: 'Executive Cabin',
}

const BUILDING_GRADE_LABELS: Record<string, string> = {
  grade_a_plus: 'Grade A+',
  grade_a: 'Grade A',
  grade_b: 'Grade B',
  premium: 'Premium',
}

const FIT_OUT_LABELS: Record<string, string> = {
  bare_shell: 'Bare Shell',
  warm_shell: 'Warm Shell',
  fully_fitted: 'Fully Fitted',
  plug_and_play: 'Plug and Play',
}

const ACCESS_HOURS_LABELS: Record<string, string> = {
  '24_7': '24/7 Access',
  'business_hours': 'Business Hours (9 AM - 6 PM)',
  'extended_hours': 'Extended Hours (7 AM - 10 PM)',
  'custom': 'Custom Hours',
}

const AMENITY_ICONS: Record<string, any> = {
  'High-Speed WiFi': Wifi,
  'Reception Services': PhoneCall,
  'Mail Handling': Mail,
  'Pantry/Cafeteria': Coffee,
  'Coffee/Tea': Coffee,
  'Security': Shield,
  'CCTV': Shield,
  'Parking': Car,
  'Video Conferencing': Monitor,
}

export default function OfficeSpaceDetails({ 
  officeSpace, 
  commercialLease,
  className 
}: OfficeSpaceDetailsProps) {
  if (!officeSpace && !commercialLease) return null

  const hasOfficeDetails = officeSpace && (
    officeSpace.space_type ||
    officeSpace.total_seats ||
    officeSpace.cabin_count ||
    officeSpace.seat_configurations?.length
  )

  const hasLeaseDetails = commercialLease && (
    commercialLease.lease_type ||
    commercialLease.rent_per_sqft ||
    commercialLease.security_deposit_months
  )

  if (!hasOfficeDetails && !hasLeaseDetails) return null

  return (
    <div className={cn("space-y-8", className)}>
      {/* Office Space Section */}
      {hasOfficeDetails && (
        <div className="luxury-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--luxury-gold)]/20 to-[var(--luxury-gold)]/5">
              <Building2 className="h-5 w-5 text-[var(--luxury-gold)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--luxury-navy)]">Office Space Details</h3>
              {officeSpace?.space_type && (
                <p className="text-sm text-gray-600">
                  {SPACE_TYPE_LABELS[officeSpace.space_type] || officeSpace.space_type}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {officeSpace?.total_seats !== undefined && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">Total Seats</span>
                </div>
                <p className="text-2xl font-bold text-[var(--luxury-navy)]">{officeSpace.total_seats}</p>
                {officeSpace.available_seats !== undefined && (
                  <p className="text-xs text-gray-500">{officeSpace.available_seats} available</p>
                )}
              </div>
            )}

            {officeSpace?.cabin_count !== undefined && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-50/50 border border-purple-100">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Cabins</span>
                </div>
                <p className="text-2xl font-bold text-[var(--luxury-navy)]">{officeSpace.cabin_count}</p>
                {officeSpace.available_cabins !== undefined && (
                  <p className="text-xs text-gray-500">{officeSpace.available_cabins} available</p>
                )}
              </div>
            )}

            {officeSpace?.meeting_rooms_count !== undefined && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-50/50 border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <Monitor className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600">Meeting Rooms</span>
                </div>
                <p className="text-2xl font-bold text-[var(--luxury-navy)]">{officeSpace.meeting_rooms_count}</p>
              </div>
            )}

            {officeSpace?.access_hours && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-50/50 border border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-xs font-medium text-orange-600">Access</span>
                </div>
                <p className="text-sm font-semibold text-[var(--luxury-navy)]">
                  {ACCESS_HOURS_LABELS[officeSpace.access_hours] || officeSpace.access_hours}
                </p>
                {officeSpace.access_hours === 'custom' && officeSpace.custom_access_hours && (
                  <p className="text-xs text-gray-500">{officeSpace.custom_access_hours}</p>
                )}
              </div>
            )}
          </div>

          {/* Building Info */}
          {(officeSpace?.building_grade || officeSpace?.fit_out_status) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {officeSpace.building_grade && (
                <span className="px-3 py-1.5 text-sm font-medium bg-[var(--luxury-navy)]/5 text-[var(--luxury-navy)] rounded-lg border border-[var(--luxury-navy)]/10">
                  {BUILDING_GRADE_LABELS[officeSpace.building_grade] || officeSpace.building_grade}
                </span>
              )}
              {officeSpace.fit_out_status && (
                <span className="px-3 py-1.5 text-sm font-medium bg-[var(--luxury-gold)]/5 text-[var(--luxury-gold)] rounded-lg border border-[var(--luxury-gold)]/10">
                  {FIT_OUT_LABELS[officeSpace.fit_out_status] || officeSpace.fit_out_status}
                </span>
              )}
            </div>
          )}

          {/* Pricing */}
          {(officeSpace?.price_per_seat_monthly || officeSpace?.price_per_seat_daily || 
            officeSpace?.price_per_cabin_monthly || officeSpace?.meeting_room_hourly_rate) && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[var(--luxury-navy)] mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {officeSpace.price_per_seat_monthly && (
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Per Seat (Monthly)</p>
                    <p className="text-lg font-bold text-[var(--luxury-navy)]">
                      ₹{officeSpace.price_per_seat_monthly.toLocaleString()}
                    </p>
                  </div>
                )}
                {officeSpace.price_per_seat_daily && (
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Per Seat (Daily)</p>
                    <p className="text-lg font-bold text-[var(--luxury-navy)]">
                      ₹{officeSpace.price_per_seat_daily.toLocaleString()}
                    </p>
                  </div>
                )}
                {officeSpace.price_per_cabin_monthly && (
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Per Cabin (Monthly)</p>
                    <p className="text-lg font-bold text-[var(--luxury-navy)]">
                      ₹{officeSpace.price_per_cabin_monthly.toLocaleString()}
                    </p>
                  </div>
                )}
                {officeSpace.meeting_room_hourly_rate && (
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Meeting Room (Hourly)</p>
                    <p className="text-lg font-bold text-[var(--luxury-navy)]">
                      ₹{officeSpace.meeting_room_hourly_rate.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seat Configurations */}
          {officeSpace?.seat_configurations && officeSpace.seat_configurations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[var(--luxury-navy)] mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Available Configurations
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Type</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-600">Capacity</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-600">Available</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-600">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {officeSpace.seat_configurations.map((config, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-3 font-medium text-[var(--luxury-navy)]">
                          {SEAT_TYPE_LABELS[config.type] || config.type}
                        </td>
                        <td className="py-3 px-3 text-center text-gray-600">
                          {config.capacity || 1} {config.capacity === 1 ? 'seat' : 'seats'}
                        </td>
                        <td className="py-3 px-3 text-center text-gray-600">
                          {config.count || 0}
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-[var(--luxury-navy)]">
                          {config.price_per_seat ? (
                            <>₹{config.price_per_seat.toLocaleString()}/{config.price_type || 'month'}</>
                          ) : (
                            'On request'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Facilities */}
          <div className="flex flex-wrap gap-3 mb-6">
            {officeSpace?.reception_available && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Reception</span>
              </div>
            )}
            {officeSpace?.mail_handling && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Mail Handling</span>
              </div>
            )}
            {officeSpace?.parking_included && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Parking Included</span>
              </div>
            )}
            {officeSpace?.pantry_cafeteria && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Pantry/Cafeteria</span>
              </div>
            )}
            {officeSpace?.flexible_terms && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Flexible Terms</span>
              </div>
            )}
          </div>

          {/* Office Amenities */}
          {officeSpace?.office_amenities && officeSpace.office_amenities.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--luxury-navy)] mb-3">Office Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {officeSpace.office_amenities.map((amenity, index) => {
                  const Icon = AMENITY_ICONS[amenity] || CheckCircle2
                  return (
                    <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm">
                      <Icon className="h-3.5 w-3.5" />
                      <span>{amenity}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Terms */}
          {(officeSpace?.minimum_commitment || officeSpace?.notice_period || officeSpace?.lease_term_min) && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-[var(--luxury-navy)] mb-3">Terms & Flexibility</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {officeSpace.minimum_commitment && (
                  <div>
                    <p className="text-gray-500">Minimum Commitment</p>
                    <p className="font-medium text-[var(--luxury-navy)]">{officeSpace.minimum_commitment}</p>
                  </div>
                )}
                {officeSpace.notice_period && (
                  <div>
                    <p className="text-gray-500">Notice Period</p>
                    <p className="font-medium text-[var(--luxury-navy)]">{officeSpace.notice_period}</p>
                  </div>
                )}
                {officeSpace.lease_term_min && officeSpace.lease_term_max && (
                  <div>
                    <p className="text-gray-500">Lease Term</p>
                    <p className="font-medium text-[var(--luxury-navy)]">{officeSpace.lease_term_min} - {officeSpace.lease_term_max} months</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Commercial Lease Section */}
      {hasLeaseDetails && (
        <div className="luxury-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--luxury-navy)]">Commercial Lease Details</h3>
              {commercialLease?.lease_type && (
                <p className="text-sm text-gray-600 capitalize">{commercialLease.lease_type}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {commercialLease?.rent_per_sqft && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Rent per Sq.ft</p>
                <p className="text-xl font-bold text-[var(--luxury-navy)]">
                  ₹{commercialLease.rent_per_sqft.toLocaleString()}
                </p>
              </div>
            )}
            {commercialLease?.cam_charges && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">CAM Charges</p>
                <p className="text-xl font-bold text-[var(--luxury-navy)]">
                  ₹{commercialLease.cam_charges.toLocaleString()}
                </p>
              </div>
            )}
            {commercialLease?.security_deposit_months && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Security Deposit</p>
                <p className="text-xl font-bold text-[var(--luxury-navy)]">
                  {commercialLease.security_deposit_months} months
                </p>
              </div>
            )}
            {commercialLease?.lock_in_period_months && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Lock-in Period</p>
                <p className="text-xl font-bold text-[var(--luxury-navy)]">
                  {commercialLease.lock_in_period_months} months
                </p>
              </div>
            )}
            {commercialLease?.agreement_duration_years && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Agreement Duration</p>
                <p className="text-xl font-bold text-[var(--luxury-navy)]">
                  {commercialLease.agreement_duration_years} years
                </p>
              </div>
            )}
            {commercialLease?.rent_escalation && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Rent Escalation</p>
                <p className="text-xl font-bold text-[var(--luxury-navy)]">
                  {commercialLease.rent_escalation}
                </p>
              </div>
            )}
          </div>

          {(commercialLease?.fit_out_allowance || commercialLease?.rent_free_period) && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-[var(--luxury-navy)] mb-3">Incentives</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                {commercialLease.fit_out_allowance && (
                  <div>
                    <p className="text-gray-500">Fit-out Allowance</p>
                    <p className="font-medium text-[var(--luxury-navy)]">₹{commercialLease.fit_out_allowance.toLocaleString()}</p>
                  </div>
                )}
                {commercialLease.rent_free_period && (
                  <div>
                    <p className="text-gray-500">Rent Free Period</p>
                    <p className="font-medium text-[var(--luxury-navy)]">{commercialLease.rent_free_period}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
