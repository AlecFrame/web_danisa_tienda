import { computed } from 'vue'
import {
  Minus,
  Croissant,
  Cookie,
  Utensils,
  Coffee,
  Cake,
  Hamburger,
  IceCreamBowl,
  Drumstick,
  Egg,
  EggFried,
  Apple,
  Leaf,
  PawPrint,
  GlassWater,
  Wine,
  BottleWine,
  Milk,
  Droplet,
  Pizza,
  IceCream,
  Snowflake,
  Refrigerator,
  Flame,
  Heater,
  Waves,
  Pencil,
  Palette,
  SprayCan,
  Hand,
  Candy,
  BrushCleaning,
  Shirt,
  Bot,
  Play,
  Skull,
  Store,
  Package,
  FileText,
  Star,
  Tag,
  Gift,
  Percent,
  Scale,
  Printer,
  PiggyBank,
  Tablets,
  BriefcaseMedical,
  Stethoscope,
  Cigarette
} from 'lucide-vue-next'


export function getIconsList() {
  return new Map([
  ['remove_24px', Minus],
  ['bakery_dining_24px', Croissant],
  ['cookie_24px', Cookie],
  ['dining_24px', Utensils],
  ['emoji_food_beverage_24px', Coffee],
  ['cake_full_24px', Cake],
  ['fastfood_24px', Hamburger],
  ['shaved_ice_24px', IceCreamBowl],
  ['hanami_dango_24px', Drumstick],
  ['egg_24px', Egg],
  ['egg_alt_24px', EggFried],
  ['nutrition_24px', Apple],
  ['nest_eco_leaf_24px', Leaf],
  ['pets_24px', PawPrint],
  ['glass_cup_24px', GlassWater],
  ['liquor_24px', Wine],
  ['water_bottle_24px', BottleWine],
  ['water_bottle_large_24px', Milk],
  ['water_drop_24px', Droplet],
  ['local_pizza_24px', Pizza],
  ['icecream_24px', IceCream],
  ['snowflake_24px', Snowflake],
  ['kitchen_24px', Refrigerator],
  ['local_fire_department_24px', Flame],
  ['oven_24px', Heater],
  ['onsen_24px', Waves],
  ['edit_24px', Pencil],
  ['palette_24px', Palette],
  ['cleaning_24px', SprayCan],
  ['clean_hands_24px', Hand],
  ['dentistry_24px', Candy],
  ['cleaning_services_24px', BrushCleaning],
  ['checkroom_24px', Shirt],
  ['smart_toy_24px', Bot],
  ['stadia_controller_24px', Play],
  ['skull_24px', Skull],
  ['store_24px', Store],
  ['box_add_24px', Package],
  ['description_24px', FileText],
  ['star_24px_fill', Star],
  ['sell_24px', Tag],
  ['featured_seasonal_and_gifts_24px', Gift],
  ['point_of_sale_24px', Percent],
  ['scale_24px', Scale],
  ['print_24px', Printer],
  ['savings_24px', PiggyBank],
  ['medication_24px', Tablets],
  ['medical_services_24px', BriefcaseMedical],
  ['stethoscope_24px', Stethoscope],
  ['smoking_rooms_24px', Cigarette],
  ['vaping_rooms_24px', Cigarette]
])} // <component :is="iconos.get(categoria.icono)" />

export function getIcon(drawable) {
  if (drawable) {
    const result = getIconsList().get(drawable)

    return result? result:Minus
  }else {
    return Minus
  }
}

export function getIconsOptions() {
  return computed(() =>
  [...getIconsList()].map(([name, component]) => ({
    name,
    component
  }))
)
}

export function androidColorToHex(color) {
    if (typeof color !== 'number' || !Number.isInteger(color)) {
        return '#FFFFFF'
    }

    const unsigned = color >>> 0
    return '#' + unsigned.toString(16).slice(-6)
}

export function androidColorToInt(hex) {
  if (typeof hex !== 'string') {
      return hex
  }

  const valor = hex.replace('#', '')

  if (!/^[0-9A-Fa-f]{6}$/.test(valor)) {
      return hex
  }

  // Agregar alpha FF
  const argb = parseInt('FF' + valor, 16)

  // Convertir a int32 con signo, como Android
  return argb | 0
}

export function getCategoriaL(id, list) {
    if (!list) return null;

    return list.find(
        categoria => categoria.idCategoria === Number(id)
    ) ?? null
}

export function getGastosList() {
  return [
    "Alquiler",
    "Servicios",
    "Mercadería",
    "Sueldos",
    "Mantenimiento",
    "Transporte",
    "Impuestos",
    "Publicidad",
    "Insumos",
    "Comisiones",
    "Otros"
  ]
}

export function getTipoPagoList() {
  return [
    "Efectivo",
    "Transferencia"
  ]
}

export function getEntidadesList() {
  return [
    "Producto",
    "Categoría",
    "Alias",
    "Venta",
    "Gasto"
  ]
}

export function getAccionesList() {
  return [
    "CREAR",
    "MODIFICAR",
    "ACTIVAR",
    "DESACTIVAR"
  ]
}

export const fechaHoy = () => {
  const hoy = new Date()
  const año = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')

  return `${año}-${mes}-${dia}`
}

export const fechaTimeNow = () => {
  const ahora = new Date()
  const año = ahora.getFullYear()
  const mes = String(ahora.getMonth() + 1).padStart(2, '0')
  const dia = String(ahora.getDate()).padStart(2, '0')
  const hora = String(ahora.getHours()).padStart(2, '0')
  const minutos = String(ahora.getMinutes()).padStart(2, '0')
  const segundos = String(ahora.getSeconds()).padStart(2, '0')

  return `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`
}

export const formatearFecha = (fecha) => {
  if (!fecha) return ''

  return new Date(fecha).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const formatearHora = (fecha) => {
  if (!fecha) return ''

  return new Date(fecha).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export const formatearFechaDate = (fecha) => {
  if (!fecha) return ''

  return new Date(fecha).toISOString().split('T')[0]
}

