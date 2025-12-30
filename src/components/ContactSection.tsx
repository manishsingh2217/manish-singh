import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { usePersonalInfo } from '@/hooks/useCMSData';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: personalInfo } = usePersonalInfo();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();
    
    if (!name || !email || !message) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (name.length > 100) {
      toast.error("Name must be less than 100 characters");
      return;
    }
    
    if (message.length > 2000) {
      toast.error("Message must be less than 2000 characters");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, message },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to send message');
      }

      // Check for success response from the edge function
      if (data?.success) {
        toast.success("Message sent successfully! I'll get back to you soon.");
        setFormData({ name: '', email: '', message: '' });
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || "Failed to send message. Please try again or email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: personalInfo?.phone },
    { icon: Mail, label: 'Email', value: personalInfo?.email },
    { icon: MapPin, label: 'Address', value: personalInfo?.address },
  ];

  return (
    <motion.section 
      id="contact" 
      className="space-y-6" 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
          <Mail className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-display font-semibold">Contact</h2>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-6">
        <h3 className="text-2xl font-display font-bold text-center">Let's Get in Touch!</h3>

        {personalInfo && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {contactInfo.map((item) => (
              item.value && (
                <div key={item.label} className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Input 
              placeholder="Your Name" 
              required 
              className="bg-secondary/30 border-border/50"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength={100}
              disabled={isSubmitting}
            />
            <Input 
              type="email" 
              placeholder="Your Email" 
              required 
              className="bg-secondary/30 border-border/50"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <Textarea 
            placeholder="Your Message" 
            rows={4} 
            required 
            className="bg-secondary/30 border-border/50"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            maxLength={2000}
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.section>
  );
};

export default ContactSection;
