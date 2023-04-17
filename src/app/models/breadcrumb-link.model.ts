export interface BreadcrumbLink {
  selector: string,
  name: string,
  link?: string | any[]
}

export interface BreadcrumbOptions {
  attachTo?: string,
  parent?: number
}