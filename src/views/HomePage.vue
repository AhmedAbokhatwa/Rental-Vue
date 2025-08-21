<template>
  <div class="modern-homepage">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-overlay"></div>
        <div class="hero-pattern"></div>
      </div>
      
      <div class="hero-content">
        <div class="container">
          <div class="hero-grid">
            <!-- Hero Text -->
            <div class="hero-text">
              <h1 class="hero-title">
                نظام إدارة المعدات
                <span class="hero-highlight">المتطور</span>
              </h1>
              <p class="hero-subtitle">
                منصة متكاملة لإدارة وتأجير المعدات مع Frappe. 
                واجهة عربية حديثة ومتجاوبة لجميع الأجهزة
              </p>
              <div class="hero-actions">
                <router-link to="/login" class="btn btn-primary btn-large">
                  <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  تسجيل الدخول
                </router-link>
                <router-link to="/register-vendor" class="btn btn-outline btn-large">
                  <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  تسجيل كمورد
                </router-link>
              </div>
            </div>
            
            <!-- Hero Stats -->
            <div class="hero-stats">
              <div class="stats-card">
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-number">500+</div>
                    <div class="stat-label">معدة متاحة</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">1000+</div>
                    <div class="stat-label">عميل راضي</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">50+</div>
                    <div class="stat-label">مورد معتمد</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">24/7</div>
                    <div class="stat-label">خدمة عملاء</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">الميزات الرئيسية</h2>
          <p class="section-subtitle">نظام متكامل لإدارة المعدات مع Frappe</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">
              <svg class="feature-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="feature.id === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                <path v-else-if="feature.id === 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                <path v-else-if="feature.id === 3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                <path v-else-if="feature.id === 4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                <path v-else-if="feature.id === 5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 004 6v12a4 4 0 004 4h12a4 4 0 004-4V6a4 4 0 00-4-4H8a4 4 0 00-3.81 2.19z"></path>
                <path v-else-if="feature.id === 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">كيف يعمل النظام</h2>
          <p class="section-subtitle">خطوات بسيطة لإدارة معداتك</p>
        </div>
        
        <div class="steps-grid">
          <div class="step-card" v-for="step in steps" :key="step.id">
            <div class="step-number">{{ step.number }}</div>
            <div class="step-icon">
              <svg class="step-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="step.id === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                <path v-else-if="step.id === 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                <path v-else-if="step.id === 3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                <path v-else-if="step.id === 4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Become a Vendor Section -->
    <section class="vendor-section">
      <div class="container">
        <div class="vendor-content">
          <div class="vendor-text">
            <h2 class="vendor-title">هل أنت مورد معدات؟</h2>
            <h3 class="vendor-subtitle">انضم إلى شبكة موردينا المعتمدين</h3>
            <p class="vendor-description">
              احصل على المزيد من العملاء وأرباح عالية من خلال منصتنا المتطورة
            </p>
            
            <div class="vendor-benefits">
              <div class="benefit-item" v-for="benefit in benefits" :key="benefit.id">
                <div class="benefit-icon">
                  <svg class="benefit-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="benefit.id === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    <path v-else-if="benefit.id === 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    <path v-else-if="benefit.id === 3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  </svg>
                </div>
                <div class="benefit-content">
                  <h4 class="benefit-title">{{ benefit.title }}</h4>
                  <p class="benefit-description">{{ benefit.description }}</p>
                </div>
              </div>
            </div>
            
            <router-link to="/register-vendor" class="btn btn-primary btn-large">
              انضم الآن كمورد
            </router-link>
          </div>
          
          <div class="vendor-image">
            <div class="image-container">
              <img src="/src/t.jpg" alt="Vendor" class="vendor-banner" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">ابدأ الآن</h2>
          <p class="cta-description">
            انضم إلى آلاف الموردين الذين يثقون بمنصتنا لإدارة معداتهم
          </p>
          <div class="cta-actions">
            <router-link to="/register-vendor" class="btn btn-primary btn-large">
              تسجيل كمورد جديد
            </router-link>
            <router-link to="/login" class="btn btn-outline btn-large">
              تسجيل الدخول
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      features: [
        {
          id: 1,
          title: 'تسجيل الدخول الآمن',
          description: 'تسجيل دخول آمن عبر Frappe مع حفظ الجلسة وإدارة متقدمة للمستخدمين',
          icon: 'ShieldCheckIcon',
          iconClass: 'bg-blue-100 text-blue-600'
        },
        {
          id: 2,
          title: 'إدارة المعدات',
          description: 'عرض وإضافة المعدات مع Frappe مع واجهة سهلة الاستخدام',
          icon: 'CubeIcon',
          iconClass: 'bg-green-100 text-green-600'
        },
        {
          id: 3,
          title: 'لوحة التحكم',
          description: 'إدارة حسابك وبياناتك بسهولة مع إحصائيات مفصلة',
          icon: 'ChartBarIcon',
          iconClass: 'bg-purple-100 text-purple-600'
        },
        {
          id: 4,
          title: 'التقارير المتقدمة',
          description: 'تقارير مفصلة عن المعدات والإيرادات والأداء',
          icon: 'DocumentReportIcon',
          iconClass: 'bg-orange-100 text-orange-600'
        },
        {
          id: 5,
          title: 'الإشعارات الذكية',
          description: 'إشعارات فورية عن حالة المعدات والطلبات الجديدة',
          icon: 'BellIcon',
          iconClass: 'bg-red-100 text-red-600'
        },
        {
          id: 6,
          title: 'التصميم المتجاوب',
          description: 'واجهة متجاوبة تعمل على جميع الأجهزة والشاشات',
          icon: 'DeviceMobileIcon',
          iconClass: 'bg-indigo-100 text-indigo-600'
        }
      ],
      steps: [
        {
          id: 1,
          number: '01',
          title: 'تسجيل الحساب',
          description: 'قم بإنشاء حساب مورد جديد في دقائق',
          icon: 'UserAddIcon',
          iconClass: 'bg-blue-100 text-blue-600'
        },
        {
          id: 2,
          number: '02',
          title: 'إضافة المعدات',
          description: 'أضف معداتك مع التفاصيل والصور',
          icon: 'PlusIcon',
          iconClass: 'bg-green-100 text-green-600'
        },
        {
          id: 3,
          number: '03',
          title: 'إدارة الطلبات',
          description: 'استقبل وإدارة طلبات الإيجار بسهولة',
          icon: 'ClipboardListIcon',
          iconClass: 'bg-purple-100 text-purple-600'
        },
        {
          id: 4,
          number: '04',
          title: 'تحقيق الأرباح',
          description: 'احصل على أرباح عالية من تأجير معداتك',
          icon: 'CurrencyDollarIcon',
          iconClass: 'bg-yellow-100 text-yellow-600'
        }
      ],
      benefits: [
        {
          id: 1,
          title: 'أرباح عالية',
          description: 'احصل على أرباح عالية من خلال تأجير معداتك',
          icon: 'CurrencyDollarIcon',
          iconClass: 'bg-green-100 text-green-600'
        },
        {
          id: 2,
          title: 'عملاء جدد',
          description: 'احصل على عملاء جدد من خلال منصتنا',
          icon: 'UserGroupIcon',
          iconClass: 'bg-blue-100 text-blue-600'
        },
        {
          id: 3,
          title: 'إدارة سهلة',
          description: 'إدارة معداتك بسهولة مع Frappe',
          icon: 'CogIcon',
          iconClass: 'bg-purple-100 text-purple-600'
        }
      ]
    }
  }
}
</script>

<style scoped>
.modern-homepage {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(17, 77, 70, 0.9) 0%, rgba(17, 77, 70, 0.7) 100%), url('/src/t.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

.hero-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  position: relative;
  z-index: 10;
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-highlight {
  background: linear-gradient(135deg, var(--color-secondary) 0%, #e8e7d0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
}

.hero-highlight::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-secondary);
  border-radius: 2px;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.btn-icon {
  width: 20px;
  height: 20px;
  margin-left: 0.5rem;
}

/* Hero Stats */
.hero-stats {
  display: flex;
  justify-content: center;
}

.stats-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* Features Section */
.features-section {
  padding: 6rem 0;
  background: var(--color-secondary);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.section-subtitle {
  font-size: 1.25rem;
  color: var(--color-primary-dark);
  max-width: 600px;
  margin: 0 auto;
  font-weight: 600;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--color-secondary);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(17, 77, 70, 0.1);
  transition: all 0.3s ease;
  text-align: center;
  border: 2px solid var(--color-primary);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: var(--gradient-primary);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(17, 77, 70, 0.2);
  border-color: var(--color-primary-dark);
}

.feature-icon {
  width: 90px;
  height: 90px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  background: var(--gradient-primary);
  box-shadow: 0 8px 20px rgba(17, 77, 70, 0.3);
  border: 3px solid var(--color-secondary);
}

.feature-svg {
  width: 45px;
  height: 45px;
  color: var(--color-secondary);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.feature-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.feature-description {
  color: var(--color-primary-dark);
  line-height: 1.7;
  font-weight: 500;
  font-size: 1rem;
}

/* How It Works Section */
.how-it-works-section {
  padding: 6rem 0;
  background: var(--color-secondary-light);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
}

.step-card {
  background: var(--color-secondary);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(17, 77, 70, 0.1);
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  border: 2px solid var(--color-primary);
  overflow: hidden;
}

.step-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: var(--gradient-primary);
}

.step-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(17, 77, 70, 0.2);
  border-color: var(--color-primary-dark);
}

.step-number {
  position: absolute;
  top: -25px;
  right: 25px;
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  color: var(--color-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.5rem;
  box-shadow: 0 6px 15px rgba(17, 77, 70, 0.3);
  border: 4px solid var(--color-secondary);
}

.step-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  background: var(--gradient-primary);
  box-shadow: 0 8px 20px rgba(17, 77, 70, 0.3);
  border: 3px solid var(--color-secondary);
}

.step-svg {
  width: 40px;
  height: 40px;
  color: var(--color-secondary);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.step-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.step-description {
  color: var(--color-primary-dark);
  line-height: 1.7;
  font-weight: 500;
  font-size: 1rem;
}

/* Vendor Section */
.vendor-section {
  padding: 6rem 0;
  background: var(--gradient-primary);
  color: var(--color-secondary);
}

.vendor-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.vendor-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-secondary);
}

.vendor-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  color: var(--color-secondary);
}

.vendor-description {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  line-height: 1.6;
  color: var(--color-secondary);
}

.vendor-benefits {
  margin-bottom: 2rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.benefit-icon {
  width: 55px;
  height: 55px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(247, 246, 225, 0.2);
  border: 2px solid rgba(247, 246, 225, 0.3);
}

.benefit-svg {
  width: 28px;
  height: 28px;
  color: var(--color-secondary);
}

.benefit-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-secondary);
}

.benefit-description {
  opacity: 0.8;
  line-height: 1.6;
  color: var(--color-secondary);
}

.vendor-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container {
  width: 300px;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  border: 3px solid var(--color-secondary);
}

.vendor-banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  background: var(--color-secondary);
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cta-description {
  font-size: 1.125rem;
  color: var(--color-primary-dark);
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 500;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }

  .vendor-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .vendor-title {
    font-size: 2rem;
  }

  .vendor-subtitle {
    font-size: 1.25rem;
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .feature-card,
  .step-card {
    padding: 1.5rem;
  }

  .stats-card {
    padding: 1.5rem;
  }
}
</style> 