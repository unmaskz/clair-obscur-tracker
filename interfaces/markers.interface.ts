interface MarkerType {
  id: number
  title: string
  icon: React.ReactNode
  color: string
  visible: boolean
}

interface MapMarker {
  id: number
  type: number
  lng: number
  lat: number
  title: string
  description: string | null
  completed: boolean
}

export type {
  MapMarker,
  MarkerType,
}