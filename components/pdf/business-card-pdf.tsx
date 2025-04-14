'use client';

import { Page, Text, View, Document, StyleSheet, Image, Font, PDFViewer } from '@react-pdf/renderer';
import { BusinessCard } from '@/types/business-card';

// Register the fonts
Font.register({
    family: 'Inter',
    src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.ttf',
});

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: 0,
    },
    cardContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '85mm',
        height: '55mm',
        backgroundColor: 'white',
        position: 'relative',
        padding: '5mm',
    },
    logo: {
        position: 'absolute',
        top: '5mm',
        right: '5mm',
        width: '40mm',
    },
    content: {
        marginTop: '20mm',
    },
    name: {
        fontSize: 18,
        fontFamily: 'Inter',
        color: '#FF5722',
        marginBottom: 2,
    },
    position: {
        fontSize: 12,
        marginBottom: 12,
        color: '#000000',
        fontFamily: 'Inter',
    },
    address: {
        fontSize: 8,
        width: '45mm',
        marginBottom: 8,
        fontFamily: 'Inter',
        color: '#000000',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    contactLabel: {
        fontSize: 8,
        fontFamily: 'Inter',
        color: '#FF5722',
        marginRight: 4,
        fontWeight: 'bold',
    },
    contactText: {
        fontSize: 8,
        fontFamily: 'Inter',
        color: '#000000',
    },
    website: {
        position: 'absolute',
        bottom: '5mm',
        right: '5mm',
        fontSize: 8,
        fontFamily: 'Inter',
        color: '#FF5722',
    },
    qrCode: {
        position: 'absolute',
        bottom: '5mm',
        right: '5mm',
        width: '20mm',
        height: '20mm',
    },
    backCard: {
        width: '85mm',
        height: '55mm',
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'hidden',
    },
    blueSection: {
        position: 'absolute',
        width: '65%',
        height: '100%',
        backgroundColor: '#0039CB',
        transform: 'skewX(-45deg) translateX(-20%)',
    },
    orangeStripe: {
        position: 'absolute',
        width: '20%',
        height: '100%',
        backgroundColor: '#FF5722',
        transform: 'skewX(-45deg) translateX(50%)',
    },
    slogan: {
        position: 'absolute',
        bottom: '5mm',
        right: '5mm',
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#FF5722',
    },
});

interface BusinessCardPDFProps {
    businessCard: BusinessCard;
    qrCodeUrl: string;
}

export function BusinessCardPDF({ businessCard, qrCodeUrl }: BusinessCardPDFProps) {
    return (
        <PDFViewer style={{ width: '100%', height: '100%' }}>
            <Document>
                {/* Front of the card */}
                <Page size={[241, 156]} style={styles.page}>
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Image style={styles.logo} src="/access-logo.png" />

                            <View style={styles.content}>
                                <Text style={styles.name}>{businessCard.fullName}</Text>
                                <Text style={styles.position}>{businessCard.position}</Text>

                                <Text style={styles.address}>
                                    Head Office: 14/15 Prince Alana Abiodun, Oniru Street, Oniru Estate, Victoria Island. Lagos, Nigeria
                                </Text>

                                <View style={styles.contactRow}>
                                    <Text style={styles.contactLabel}>M</Text>
                                    <Text style={styles.contactText}>{businessCard.phone}</Text>
                                </View>

                                <View style={styles.contactRow}>
                                    <Text style={styles.contactLabel}>E</Text>
                                    <Text style={styles.contactText}>{businessCard.email}</Text>
                                </View>
                            </View>

                            <Text style={styles.website}>www.accessbankplc.com</Text>
                            <Image style={styles.qrCode} src={`${qrCodeUrl}`} />
                        </View>
                    </View>
                </Page>

                {/* Back of the card */}
                <Page size={[241, 156]} style={styles.page}>
                    <View style={styles.cardContainer}>
                        <View style={styles.backCard}>
                            <View style={styles.blueSection} />
                            <View style={styles.orangeStripe} />
                            <Text style={styles.slogan}>more than banking</Text>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
} 