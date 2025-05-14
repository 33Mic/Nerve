import Link from "next/link"
import styles from "../page.module.css"

export default function Page() {
	return (
		<div className={styles.page}>
			<h1>Hello NEXTJS!</h1>
			<p><Link href="../challenge/">Next Page</Link></p>
		</div>
	)
}