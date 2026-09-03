import { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ارسال پیام به API
    console.log('Form data:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="contact-container">
      <div className="contact-grid">
        <div className="contact-info">
          <h1>تماس با ما</h1>
          <p>ما همواره آماده پاسخگویی به سوالات و نظرات شما هستیم</p>
          
          <div className="info-items">
            <div className="info-item">
              <span>📍</span>
              <div>
                <h4>آدرس</h4>
                <p>تهران، خیابان اصلی، پلاک ۱۲۳</p>
              </div>
            </div>
            <div className="info-item">
              <span>📞</span>
              <div>
                <h4>تلفن</h4>
                <p>۰۲۱-۱۲۳۴۵۶۷۸</p>
              </div>
            </div>
            <div className="info-item">
              <span>✉️</span>
              <div>
                <h4>ایمیل</h4>
                <p>info@honarmandshop.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h2>ارسال پیام</h2>
          {submitted && (
            <div className="success-message">
              پیام شما با موفقیت ارسال شد
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>نام و نام خانوادگی</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="نام خود را وارد کنید"
              />
            </div>
            <div className="form-group">
              <label>ایمیل</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ایمیل خود را وارد کنید"
              />
            </div>
            <div className="form-group">
              <label>موضوع</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="موضوع پیام را وارد کنید"
              />
            </div>
            <div className="form-group">
              <label>پیام</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="پیام خود را بنویسید"
              />
            </div>
            <button type="submit" className="submit-btn">
              ارسال پیام
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
