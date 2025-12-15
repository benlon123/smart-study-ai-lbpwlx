
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import DateTimePicker from '@react-native-community/datetimepicker';

interface RevisionEvent {
  id: string;
  title: string;
  date: Date;
  type: 'revision' | 'unavailable' | 'event';
  subject?: string;
  notes?: string;
}

const CALENDAR_STORAGE_KEY = '@smartstudy_calendar_events';

export default function CalendarScreen() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<RevisionEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<'revision' | 'unavailable' | 'event'>('revision');
  const [eventSubject, setEventSubject] = useState('');
  const [eventNotes, setEventNotes] = useState('');

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user?.id]);

  const loadEvents = async () => {
    try {
      const eventsJson = await AsyncStorage.getItem(`${CALENDAR_STORAGE_KEY}_${user?.id}`);
      if (eventsJson) {
        const loadedEvents = JSON.parse(eventsJson);
        const parsedEvents = loadedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date),
        }));
        setEvents(parsedEvents);
        console.log(`Loaded ${parsedEvents.length} calendar events`);
      }
    } catch (error) {
      console.error('Error loading calendar events:', error);
    }
  };

  const saveEvents = async (newEvents: RevisionEvent[]) => {
    try {
      await AsyncStorage.setItem(`${CALENDAR_STORAGE_KEY}_${user?.id}`, JSON.stringify(newEvents));
      console.log(`Saved ${newEvents.length} calendar events`);
    } catch (error) {
      console.error('Error saving calendar events:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDatePress = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (!eventTitle.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    const newEvent: RevisionEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: eventTitle,
      date: selectedDate || new Date(),
      type: eventType,
      subject: eventSubject || undefined,
      notes: eventNotes || undefined,
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);

    setShowEventModal(false);
    setEventTitle('');
    setEventType('revision');
    setEventSubject('');
    setEventNotes('');

    Alert.alert('Success', 'Event added to calendar');
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedEvents = events.filter(e => e.id !== eventId);
            setEvents(updatedEvents);
            saveEvents(updatedEvents);
          },
        },
      ]
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const renderCalendar = () => {
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Week day headers
    const headers = weekDays.map((day, index) => (
      <View key={`header-${index}`} style={styles.dayHeader}>
        <Text style={styles.dayHeaderText}>{day}</Text>
      </View>
    ));

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();
      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      days.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[
            styles.dayCell,
            isToday && styles.todayCell,
            isSelected && styles.selectedCell,
          ]}
          onPress={() => handleDatePress(day)}
        >
          <Text
            style={[
              styles.dayText,
              isToday && styles.todayText,
              isSelected && styles.selectedText,
            ]}
          >
            {day}
          </Text>
          {dayEvents.length > 0 && (
            <View style={styles.eventIndicators}>
              {dayEvents.slice(0, 3).map((event, index) => (
                <View
                  key={index}
                  style={[
                    styles.eventDot,
                    event.type === 'revision' && styles.revisionDot,
                    event.type === 'unavailable' && styles.unavailableDot,
                    event.type === 'event' && styles.generalEventDot,
                  ]}
                />
              ))}
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.weekDaysRow}>{headers}</View>
        <View style={styles.daysGrid}>{days}</View>
      </View>
    );
  };

  const renderEventModal = () => (
    <Modal
      visible={showEventModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowEventModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowEventModal(false)}
          >
            <IconSymbol
              ios_icon_name="xmark"
              android_material_icon_name="close"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Event</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.inputLabel}>Event Type</Text>
          <View style={styles.typeSelector}>
            {(['revision', 'unavailable', 'event'] as const).map((type, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.typeChip,
                    eventType === type && styles.typeChipSelected,
                  ]}
                  onPress={() => setEventType(type)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      eventType === type && styles.typeChipTextSelected,
                    ]}
                  >
                    {type === 'revision' ? 'Revision' : type === 'unavailable' ? 'Unavailable' : 'Event'}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>

          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Study Mathematics"
            placeholderTextColor={colors.textSecondary}
            value={eventTitle}
            onChangeText={setEventTitle}
          />

          {eventType === 'revision' && (
            <>
              <Text style={styles.inputLabel}>Subject (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Mathematics"
                placeholderTextColor={colors.textSecondary}
                value={eventSubject}
                onChangeText={setEventSubject}
              />
            </>
          )}

          <Text style={styles.inputLabel}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any additional notes..."
            placeholderTextColor={colors.textSecondary}
            value={eventNotes}
            onChangeText={setEventNotes}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.inputLabel}>Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
            </Text>
            <IconSymbol
              ios_icon_name="calendar"
              android_material_icon_name="calendar-today"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) {
                  setSelectedDate(date);
                }
              }}
            />
          )}

          <TouchableOpacity
            style={[commonStyles.primaryButton, styles.saveButton]}
            onPress={handleSaveEvent}
          >
            <Text style={commonStyles.primaryButtonText}>Save Event</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  if (!user) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <IconSymbol
          ios_icon_name="calendar"
          android_material_icon_name="calendar-today"
          size={80}
          color={colors.textSecondary}
        />
        <Text style={[commonStyles.subtitle, styles.notAuthTitle]}>
          Sign In Required
        </Text>
        <Text style={[commonStyles.textSecondary, styles.notAuthText]}>
          Sign in to access your revision calendar
        </Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Revision Calendar</Text>
          <Text style={commonStyles.textSecondary}>
            Plan your revision and track events
          </Text>
        </View>

        <View style={styles.monthNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={previousMonth}>
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="chevron-left"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{monthName}</Text>
          <TouchableOpacity style={styles.navButton} onPress={nextMonth}>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {renderCalendar()}

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.revisionDot]} />
            <Text style={styles.legendText}>Revision</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.unavailableDot]} />
            <Text style={styles.legendText}>Unavailable</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.generalEventDot]} />
            <Text style={styles.legendText}>Event</Text>
          </View>
        </View>

        {selectedDate && (
          <View style={styles.selectedDateSection}>
            <View style={styles.selectedDateHeader}>
              <Text style={styles.selectedDateTitle}>
                {selectedDate.toLocaleDateString('default', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <TouchableOpacity
                style={styles.addEventButton}
                onPress={handleAddEvent}
              >
                <IconSymbol
                  ios_icon_name="plus"
                  android_material_icon_name="add"
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            {selectedDateEvents.length === 0 ? (
              <View style={styles.noEventsContainer}>
                <Text style={styles.noEventsText}>No events scheduled</Text>
                <Text style={styles.noEventsSubtext}>
                  Tap the + button to add an event
                </Text>
              </View>
            ) : (
              <View style={styles.eventsList}>
                {selectedDateEvents.map((event, index) => (
                  <React.Fragment key={index}>
                    <View style={styles.eventCard}>
                      <View style={styles.eventCardHeader}>
                        <View
                          style={[
                            styles.eventTypeIndicator,
                            event.type === 'revision' && styles.revisionIndicator,
                            event.type === 'unavailable' && styles.unavailableIndicator,
                            event.type === 'event' && styles.generalEventIndicator,
                          ]}
                        />
                        <View style={styles.eventCardContent}>
                          <Text style={styles.eventCardTitle}>{event.title}</Text>
                          {event.subject && (
                            <Text style={styles.eventCardSubject}>{event.subject}</Text>
                          )}
                          {event.notes && (
                            <Text style={styles.eventCardNotes}>{event.notes}</Text>
                          )}
                        </View>
                        <TouchableOpacity
                          style={styles.deleteEventButton}
                          onPress={() => handleDeleteEvent(event.id)}
                        >
                          <IconSymbol
                            ios_icon_name="trash"
                            android_material_icon_name="delete"
                            size={20}
                            color={colors.error}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.statsSection}>
          <Text style={styles.statsSectionTitle}>This Month</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {events.filter(e => e.type === 'revision' && e.date.getMonth() === currentDate.getMonth()).length}
              </Text>
              <Text style={styles.statLabel}>Revision Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {events.filter(e => e.type === 'unavailable' && e.date.getMonth() === currentDate.getMonth()).length}
              </Text>
              <Text style={styles.statLabel}>Unavailable Days</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {events.filter(e => e.type === 'event' && e.date.getMonth() === currentDate.getMonth()).length}
              </Text>
              <Text style={styles.statLabel}>Other Events</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {renderEventModal()}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  calendarContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  todayCell: {
    backgroundColor: colors.primary + '15',
    borderRadius: 8,
  },
  selectedCell: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  todayText: {
    color: colors.primary,
    fontWeight: '700',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  eventIndicators: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  revisionDot: {
    backgroundColor: colors.primary,
  },
  unavailableDot: {
    backgroundColor: colors.error,
  },
  generalEventDot: {
    backgroundColor: colors.highlight,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  selectedDateSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  addEventButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noEventsContainer: {
    backgroundColor: colors.card,
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  noEventsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  eventTypeIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
  },
  revisionIndicator: {
    backgroundColor: colors.primary,
  },
  unavailableIndicator: {
    backgroundColor: colors.error,
  },
  generalEventIndicator: {
    backgroundColor: colors.highlight,
  },
  eventCardContent: {
    flex: 1,
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  eventCardSubject: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
  },
  eventCardNotes: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  deleteEventButton: {
    padding: 4,
  },
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  typeChipTextSelected: {
    color: '#FFFFFF',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  saveButton: {
    marginTop: 24,
  },
  notAuthTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  notAuthText: {
    textAlign: 'center',
  },
});
