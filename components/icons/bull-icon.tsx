import type { SVGProps } from "react"
import Image from "next/image"

export function BullIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="relative" style={{ width: props.width || "32px", height: props.height || "32px" }}>
      <Image
        src="/images/bull-logo.png"
        alt="DipBuyer Logo"
        width={props.width ? Number(props.width) : 32}
        height={props.height ? Number(props.height) : 32}
        className="object-contain"
      />
    </div>
  )
}
