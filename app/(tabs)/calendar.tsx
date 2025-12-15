
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function CalendarScreen() {
  const { settings, getTextSizeMultiplier } = useSettings();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const containerStyle = settings.theme.mode === 'dark'
    ? [commonStyles.container, styles.darkContainer]
    : commonStyles.container;

  const textColor = settings.theme.mode === 'dark' ? '#FFFFFF' : colors.text;
  const cardBg = settings.theme.mode === 'dark' ? '#1a1a1a' : colors.card;
  const textMultiplier = getTextSizeMultiplier();

  const upcomingEvents = [
    {
      id: '1',
      title: 'Math Revision Session',
      date: 'Today, 3:00 PM',
      subject: 'Mathematics',
      color: colors.primary,
    },
    {
      id: '2',
      title: 'Biology Quiz',
      date: 'Tomorrow, 10:00 AM',
      subject: 'Biology',
      color: colors.secondary,
    },
    {
      id: '3',
      title: 'Chemistry Flashcards',
      date: 'Friday, 2:00 PM',
      subject: 'Chemistry',
      color: colors.accent,
    },
  ];

  return (
    <View style={containerStyle}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[
            commonStyles.title,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 28 * textMultiplier }
          ]}>
            Calendar
          </Text>
          <Text style={[
            commonStyles.textSecondary,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { fontSize: 14 * textMultiplier }
          ]}>
            Plan your study sessions
          </Text>
        </View>

        <View style={styles.calendarCard}>
          <View style={[styles.calendarHeader, { backgroundColor: cardBg }]}>
            <TouchableOpacity>
              <IconSymbol
                ios_icon_name="chevron.left"
                android_material_icon_name="chevron-left"
                size={24}
                color={textColor}
              />
            </TouchableOpacity>
            <Text style={[
              styles.monthText,
              settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
              { color: textColor, fontSize: 18 * textMultiplier }
            ]}>
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={24}
                color={textColor}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.calendarGrid, { backgroundColor: cardBg }]}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <View key={index} style={styles.dayHeader}>
                <Text style={[
                  styles.dayHeaderText,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 12 * textMultiplier }
                ]}>
                  {day}
                </Text>
              </View>
            ))}
            {Array.from({ length: 35 }, (_, i) => i + 1).map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCell,
                  day === selectedDate.getDate() && styles.selectedDay,
                  { backgroundColor: day === selectedDate.getDate() ? colors.primary : 'transparent' }
                ]}
                onPress={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(day);
                  setSelectedDate(newDate);
                }}
              >
                <Text style={[
                  styles.dayCellText,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { 
                    color: day === selectedDate.getDate() ? '#FFFFFF' : textColor,
                    fontSize: 14 * textMultiplier 
                  }
                ]}>
                  {day <= 31 ? day : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { color: textColor, fontSize: 20 * textMultiplier }
          ]}>
            Upcoming Events
          </Text>

          {upcomingEvents.map((event) => (
            <View key={event.id} style={[styles.eventCard, { backgroundColor: cardBg }]}>
              <View style={[styles.eventIndicator, { backgroundColor: event.color }]} />
              <View style={styles.eventContent}>
                <Text style={[
                  styles.eventTitle,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { color: textColor, fontSize: 16 * textMultiplier }
                ]}>
                  {event.title}
                </Text>
                <Text style={[
                  styles.eventSubject,
                  settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                  { fontSize: 13 * textMultiplier }
                ]}>
                  {event.subject}
                </Text>
                <View style={styles.eventTime}>
                  <IconSymbol
                    ios_icon_name="clock.fill"
                    android_material_icon_name="schedule"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={[
                    styles.eventTimeText,
                    settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
                    { fontSize: 13 * textMultiplier }
                  ]}>
                    {event.date}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.eventAction}>
                <IconSymbol
                  ios_icon_name="chevron.right"
                  android_material_icon_name="chevron-right"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            console.log('Add event');
          }}
        >
          <IconSymbol
            ios_icon_name="plus"
            android_material_icon_name="add"
            size={24}
            color="#FFFFFF"
          />
          <Text style={[
            styles.addButtonText,
            settings.accessibility.dyslexiaFont && styles.dyslexiaFont,
            { fontSize: 16 * textMultiplier }
          ]}>
            Add Study Session
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 0,
    paddingBottom: 120,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  calendarCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.card,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.card,
    padding: 8,
  },
  dayHeader: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  selectedDay: {
    backgroundColor: colors.primary,
  },
  dayCellText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  eventIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  eventSubject: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventTimeText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  eventAction: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dyslexiaFont: {
    fontFamily: 'OpenDyslexic',
  },
});
