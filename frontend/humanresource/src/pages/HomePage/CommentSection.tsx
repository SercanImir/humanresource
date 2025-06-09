
import "./CommentSection.css"

// Örnek kullanıcı fotoğrafları (assets/images içinde)
import user1 from "../../assets/images/user1.png";


interface Testimonial {
    img: string;
    name: string;
    role: string;
    quote: string;
}

const testimonials: Testimonial[] = [
    {
        img: user1,
        name: "Ayşe Yılmaz",
        role: "İK Yöneticisi, Acme Co.",
        quote:
            "PeopleMesh ile personel kayıt süreçlerimiz %50 daha hızlı tamamlanıyor. Kesinlikle tavsiye ederim!",
    },
    {
        img: user1,
        name: "Mehmet Demir",
        role: "Operasyon Müdürü, Beta Ltd.",
        quote:
            "Kullanıcı arayüzü o kadar basit ki, ek eğitim almadan tüm departman anında adapte oldu.",
    },
    {
        img: user1,
        name: "Zeynep Kara",
        role: "CEO Yardımcısı, Gamma AŞ",
        quote:
            "Raporlama modülü sayesinde aylık performans analizlerimizde büyük zaman kazandık.",
    },
];

function CommentSection () {
    return(
    <section className="testimonials-section" id="testimonials">
        <h2 className="testimonials-title">What Our Clients Say</h2>
        <div className="testimonials-grid">
            {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                    <img src={t.img} alt={t.name} className="testimonial-avatar"/>
                    <p className="testimonial-quote">"{t.quote}"</p>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                </div>
            ))}
        </div>
    </section>
    );
}
export default CommentSection;
